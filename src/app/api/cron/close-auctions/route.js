import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { sendWinnerEmail } from "../../../../lib/resend";

export async function GET(request) {
  try {
    // Optional Security: Verify cron secret if set in environment variables
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all ACTIVE products where endTime has passed
    const expiredProducts = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        endTime: { lte: new Date() }
      },
      include: {
        bids: {
          orderBy: { amount: "desc" },
          take: 1, // Only fetch the highest bid
          include: { bidder: true }
        }
      }
    });

    if (expiredProducts.length === 0) {
      return NextResponse.json({ message: "No expired auctions to close at this time." });
    }

    const closedIds = [];
    let emailsSent = 0;

    // Process each expired product
    for (const product of expiredProducts) {
      // 1. Mark product as CLOSED
      await prisma.product.update({
        where: { id: product.id },
        data: { status: "CLOSED" }
      });
      
      closedIds.push(product.id);

      // 2. If there are bids, send the winning email
      if (product.bids.length > 0) {
        const winningBid = product.bids[0];
        const winner = winningBid.bidder;
        
        await sendWinnerEmail(
          winner.email,
          winner.username,
          product.title,
          winningBid.amount
        );
        emailsSent++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully closed ${closedIds.length} auctions. Sent ${emailsSent} winning emails.`,
      closedIds
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Failed to process cron job" }, { status: 500 });
  }
}
