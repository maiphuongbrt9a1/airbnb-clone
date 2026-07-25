"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

/**
 * Schema for register
 */
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error("Invalid registration input");
  }

  /**
   * Prevent duplicate email
   */
  const existing = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  if (existing) {
    throw new Error("Email has already existed");
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      hashedPassword: hashedPassword,
    },
  });

  redirect("/login");
}
