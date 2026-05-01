"use server";

import { prisma } from "../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}

export async function getAdminStats() {
  await requireAdmin();
  try {
    const [userCount, productCount, bidCount, products, users] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.bid.count(),
      prisma.product.findMany({
        include: {
          seller: { select: { name: true, username: true } },
          _count: { select: { bids: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          bidCount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { stats: { userCount, productCount, bidCount }, products, users };
  } catch (error) {
    console.error("Admin stats error:", error);
    return { error: "Failed to load admin data" };
  }
}

export async function toggleProductStatus(productId, currentStatus) {
  await requireAdmin();
  try {
    const newStatus = currentStatus === "ACTIVE" ? "CLOSED" : "ACTIVE";
    await prisma.product.update({
      where: { id: productId },
      data: { status: newStatus },
    });
    revalidatePath("/admin");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update status" };
  }
}

export async function deleteProduct(productId) {
  await requireAdmin();
  try {
    // Delete bids first (FK constraint)
    await prisma.bid.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/admin");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete product" };
  }
}

export async function promoteToAdmin(userId) {
  await requireAdmin();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to promote user" };
  }
}

export async function deleteUser(userId) {
  await requireAdmin();
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Delete all bids placed by this user
      await tx.bid.deleteMany({ where: { bidderId: userId } });
      
      // 2. Find all products created by this user
      const userProducts = await tx.product.findMany({ where: { sellerId: userId } });
      const productIds = userProducts.map((p) => p.id);
      
      // 3. Delete all bids placed on this user's products
      if (productIds.length > 0) {
        await tx.bid.deleteMany({ where: { productId: { in: productIds } } });
      }
      
      // 4. Delete all products created by this user
      await tx.product.deleteMany({ where: { sellerId: userId } });
      
      // 5. Finally, delete the user's account
      await tx.user.delete({ where: { id: userId } });
    });
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { error: "Failed to delete user" };
  }
}
