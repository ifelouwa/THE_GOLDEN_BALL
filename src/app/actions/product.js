"use server";

import { prisma } from "../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        seller: {
          select: { name: true, username: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return { products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { error: "Failed to fetch products" };
  }
}

export async function getProductById(id) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: { name: true, username: true }
        },
        bids: {
          include: {
            bidder: { select: { name: true, username: true } }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    if (!product) return { error: "Product not found" };
    return { product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { error: "Failed to fetch product" };
  }
}


export async function placeBid(productId, amount) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { error: "You must be signed in to place a bid" };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId }
      });

      if (!product) throw new Error("Product not found");
      if (product.status !== "ACTIVE") throw new Error("Auction is closed");
      if (new Date() > new Date(product.endTime)) throw new Error("Auction has expired");
      if (product.sellerId === session.user.id) throw new Error("You cannot bid on your own product");
      
      const currentPrice = product.currentPrice || product.startingPrice;
      if (amount <= currentPrice) {
        throw new Error(`Bid must be greater than ${product.currency || "$"}${currentPrice}`);
      }

      const bid = await tx.bid.create({
        data: {
          amount,
          bidderId: session.user.id,
          productId
        }
      });

      await tx.product.update({
        where: { id: productId },
        data: { currentPrice: amount }
      });

      await tx.user.update({
        where: { id: session.user.id },
        data: { bidCount: { increment: 1 } }
      });

      return bid;
    });

    revalidatePath("/products");
    return { success: true, bid: result };
  } catch (error) {
    return { error: error.message || "Failed to place bid" };
  }
}

export async function createProduct(formData) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { error: "You must be signed in to create an auction" };
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const startingPrice = parseFloat(formData.get("startingPrice"));
  const currency = formData.get("currency") || "$";
  const image = formData.get("image");
  const endTime = new Date(formData.get("endTime"));

  if (!title || !startingPrice || !image || !endTime) {
    return { error: "Required fields are missing" };
  }

  try {
    const product = await prisma.product.create({
      data: {
        title,
        description,
        startingPrice,
        currentPrice: startingPrice,
        currency,
        image,
        endTime,
        startTime: new Date(),
        sellerId: session.user.id,
        status: "ACTIVE"
      }
    });

    revalidatePath("/products");
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Failed to create auction" };
  }
}
