"use server";

import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function register(formData) {
  const name = formData.get("name");
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const phone = formData.get("phone");

  if (!name || !username || !email || !password || !phone) {
    return { error: "All fields are required" };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return { error: "User already exists with this email or username" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        phone,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An error occurred during registration" };
  }
}
