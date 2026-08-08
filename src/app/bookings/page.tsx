import { PageIntro } from "@/components/ui/page-intro";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uiShell } from "@/lib/ui-classes";
import { CalendarCheck2, CalendarX2, Wallet } from "lucide-react";

type BookingsPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function BookingsPage({
  searchParams,
}: BookingsPageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const reservations = await prisma.reservation.findMany({
    where: {
      userId: user.id,
    },
    include: {
      listing: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const today = new Date();
  const activeBookings = reservations.filter(
    (reservation) => reservation.endDate >= today,
  );
  const totalCharged = reservations.reduce(
    (sum, reservation) => reservation.totalPrice + sum,
    0,
  );
  return (
    <main className={uiShell.pageContainer}>
      <PageIntro
        badge="Your Bookings"
        icon={CalendarCheck2}
        title="Your Reservations"
        description="Track upcoming your stays, review completed trips, and manage active bookings"
      ></PageIntro>
      {query.message ? (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 ">
          {query.message}
        </p>
      ) : null}

      <section className="mt-6 space-y-3 md:space-y-4">
        {reservations.length === 0 ? (
          <p className="">Empty state</p>
        ) : (
          reservations.map((reservation) => (
            <p key={reservation.id}>{reservation.listing.title}</p>
          ))
        )}
      </section>
    </main>
  );
}
