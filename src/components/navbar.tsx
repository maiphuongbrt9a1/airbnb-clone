import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { House } from "lucide-react";
import Link from "next/link";

export async function Navbar() {
  const user = await getCurrentUser();
  const hasHostedListings = user
    ? (await prisma.listing.count({
        where: {
          userId: user.id,
        },
      })) > 0
    : false;
  const hostCtaLabel = hasHostedListings ? "Manage hosting" : "Start hosting";

  return (
    <header className="sticky top-0 border-b z-40 border-ink-200/80 bg-surface/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href={"/"}>
          <House></House>
        </Link>
      </nav>
    </header>
  );
}
