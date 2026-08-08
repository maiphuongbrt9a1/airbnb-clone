import { ReservationCard } from "@/components/bookings/reservation-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { StatCard } from "@/components/ui/stat-card";
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

      <section className="mt-5 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total bookings" value={reservations.length} />
        <StatCard label="Active bookings" value={activeBookings.length} />
        <StatCard label="Total spend" value={`${totalCharged}`} icon={Wallet} />
      </section>

      <section className="mt-6 space-y-3 md:space-y-4">
        {reservations.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="No reservation yet"
            description="Reserve your first stay and it will appear here."
          />
        ) : (
          reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              today={today}
            />
          ))
        )}
      </section>
    </main>
  );
}
