import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// SignInSchema is the rules for the email/password from the before we hit the database

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" as const },
  page: {
    signIn: "/login",
  },
  provider: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        // Users who only signed up with Google never have hashedPassword
        if (!user?.hashedPassword) return null;

        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.hashedPassword,
        );

        if (!isValid) return null;

        return user;
      },
    }),
  ],
};
