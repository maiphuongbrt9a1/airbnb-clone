import { authOptions } from "@/auth/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  let session;

  try {
    session = await getServerSession(authOptions);
  } catch {
    return null;
  }

  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  return user
    ? {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    : null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}
