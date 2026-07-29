import { HomeSearchBar } from "@/components/home-search-bar";
import { SafeImage } from "@/components/safe-image";
import { fetchDemoProperties } from "@/lib/demo-properties";
import { format } from "date-fns";
import {
  ChevronRight,
  Flame,
  HomeIcon,
  Landmark,
  Mountain,
  Palmtree,
  Snowflake,
  Star,
  TreePalm,
  User,
  Waves,
} from "lucide-react";
import Link from "next/link";

type HomePageProps = {
  searchParams: Promise<{
    location?: string;
    category?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    adults?: string;
    children?: string;
    infants?: string;
  }>;
};

const categoryItems = [
  { label: "Scenic view", icon: Mountain },
  { label: "Beachfront", icon: Palmtree },
  { label: "Guest favorites", icon: Flame },
  { label: "Cabins", icon: HomeIcon },
  { label: "Countryside stays", icon: TreePalm },
  { label: "Lakefront", icon: Waves },
  { label: "Historic homes", icon: Landmark },
  { label: "ski-in/out", icon: Snowflake },
];

type UnifiedCard = {
  id: string;
  title: string;
  image: string;
  city: string;
  category: string;
  hostName: string;
  rating: number;
  price: number;
  maxGuests: number;
  availableDate: string[];
  isExternal: boolean;
};

export function normalizeUsCity(location: string) {
  const lower = location.toLowerCase();
  if (lower.includes("new york")) return "New York, United States";
  if (lower.includes("los angeles")) return "Los Angeles, United States";
  if (lower.includes("miami")) return "Miami, United States";
  if (lower.includes("chicago")) return "Chicago, United States";
  if (lower.includes("seattle")) return "Seattle, United States";
  if (lower.includes("sans francisco")) return "Sans Francisco, United States";
  if (lower.includes("boston")) return "Boston, United States";

  return "United States";
}

export function buildDateRangeInclusive(start: Date, end: Date) {
  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function isRangeAvailable(
  availableDates: string[],
  checkIn?: string,
  checkOut?: string,
) {
  if (!checkIn || !checkOut) {
    return true;
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return true;
  }

  const requested = buildDateRangeInclusive(start, end);

  if (availableDates.length === 0) {
    return true;
  }

  const mdSet = new Set(
    availableDates
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .map((d) => d.slice(5)),
  );
  return requested.every((d) => mdSet.has(d.slice(5)));
}

export function formatDateRange(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return "Anytime";
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Anytime";
  }

  return `${format(start, "MMM d")}-${format(end, "MMM d")}`;
}

export function groupByCity(cards: UnifiedCard[]) {
  const grouped = new Map<string, UnifiedCard[]>();
  for (const card of cards) {
    const list = grouped.get(card.city) ?? [];
    list.push(card);
    grouped.set(card.city, list);
  }

  return Array.from(grouped.entries()).map(([city, item]) => ({ city, item }));
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const buildingListingHref = (listingId: string) => `/listing/${listingId}`;
  const hasAnyFilters = Boolean(params.category?.trim());
  const demoProperties = await fetchDemoProperties();
  const hasLocationSearch = Boolean(params.location?.trim());

  const allCard: UnifiedCard[] = [
    ...demoProperties.map((property, index) => ({
      id: property.id,
      title: property.title,
      image: property.image,
      city: normalizeUsCity(property.city),
      category:
        categoryItems[index % categoryItems.length]?.label ?? "Trending",
      hostName: property.hostName,
      rating: property.rating,
      price: property.pricePerNight,
      maxGuests: property.maxGuests,
      availableDate: property.availableDates,
      isExternal: true,
    })),
  ];

  const requestedGuests =
    Number(params.adults ?? 0) +
      Number(params.children ?? 0) +
      Number(params.infants ?? 0) ||
    Number(params.guests) ||
    1;

  const unifiedCards = allCard.filter((card) => {
    const byLocation = params.location?.trim()
      ? card.city.toLowerCase().includes(params.location.toLowerCase())
      : true;

    const byCategory = params.category
      ? card.category.toLowerCase() === params.category.toLowerCase()
      : true;

    const byGuests = card.maxGuests >= requestedGuests;

    return byLocation && byCategory && byGuests;
  });

  const limitedCards = unifiedCards.slice(0, 20);
  const defaultGridCards = limitedCards;
  const groupedCards = groupByCity(limitedCards);

  const adults = Number(params.adults ?? 0) || 0;
  const children = Number(params.children ?? 0) || 0;
  const infants = Number(params.infants ?? 0) || 0;

  const guestParts: string[] = [];
  if (adults > 0) {
    guestParts.push(`${adults} adult${adults > 1 ? "s" : ""}`);
  }

  if (children > 0) {
    guestParts.push(`${children} child${children > 1 ? "ren" : ""}`);
  }
  if (infants > 0) {
    guestParts.push(`${infants} infant${infants > 1 ? "s" : ""}`);
  }

  const locationLabel = params.location?.trim() || "Anywhere";
  const dateLabel = formatDateRange(params.checkIn, params.checkOut);
  const guestsLabel =
    guestParts.length > 0
      ? guestParts.join(", ")
      : `${requestedGuests} guest${requestedGuests > 1 ? "s" : ""}`;

  return (
    <main className="mx-auto min-h-screen max-w-7xl pb-14 pt-8 px-4 md:px-8 md:pb-12 md:pt-6">
      <section className="rounded-3xl border border-ink-200 bg-gradient-to-br from-brand-50 via-surface to-ink-50 p-6 md:p-10">
        <div className="mx-auto max-w-[50.5rem] text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 ">
            Thoughtfully selected homes across the United States
          </p>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-shadow-ink-900 md:mt-3 md:text-5xl">
            Find the right place to stay
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-600 md:mt-3 md:text-base ">
            Explore professionally presented stays in leading US destinations.
            Filter by locations, dates and guest count to shortlist the best fit
            for your trip.
          </p>
        </div>

        <div className="mx-auto mt-7 max-w-[57.5rem] md:mt-8">
          {/* Home search bar */}
          <HomeSearchBar
            initialAdults={params.adults}
            initialCheckIn={params.checkIn}
            initialCheckOut={params.checkOut}
            initialChildren={params.children}
            initialGuests={params.guests}
            initialInfants={params.infants}
            initialLocation={params.location}
          />
        </div>
        <div className="mx-auto mt-6 flex max-w-[57.5rem] items-start justify-between gap-3">
          <div className="hide-scrollbar flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
            {categoryItems.map((item) => {
              const Icon = item.icon;
              const isActive = params.category === item.label;
              return (
                <Link
                  key={item.label}
                  href={`/?category=${encodeURIComponent(item.label)}${params.location ? `&location=${encodeURIComponent(params.location)}` : ""}${params.guests ? `&guests=${encodeURIComponent(params.guests)}` : ""}${params.adults ? `&adults=${encodeURIComponent(params.adults)}` : ""}${params.children ? `&children=${encodeURIComponent(params.children)}` : ""}${params.infants ? `&infants=${encodeURIComponent(params.infants)}` : ""}${params.checkIn ? `&checkIn=${encodeURIComponent(params.checkIn)}` : ""}${params.checkOut ? `&checkOut=${encodeURIComponent(params.checkOut)}` : ""}`}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${isActive ? "border-ink-900 bg-ink-900 text-white" : "border-ink-300 text-ink-700 hover:bg-ink-100"}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="">{item.label}</span>
                </Link>
              );
            })}
          </div>
          {/* has any filters */}
          {hasAnyFilters ? (
            <Link
              href={"/"}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              Clear filters
            </Link>
          ) : null}
        </div>
        <p className="mx-auto mt-3 max-w-[57.5rem] text-sm text-ink-600">
          Showing stays for{" "}
          <span className="font-medium text-ink-900">{guestsLabel}</span>
          {" . "}
          <span className="font-medium text-ink-900">{dateLabel}</span>
          {" . "}
          <span className="font-medium text-ink-900">{locationLabel}</span>
        </p>
      </section>

      {unifiedCards.length === 0 ? (
        <section className="mt-10 md:mt-8">
          <p className="text-ink-600">
            No stays match your current filter. Try adjusting destination,
            dates, or guest count.
          </p>
        </section>
      ) : (
        <>
          {hasLocationSearch ? (
            <section className="mt-10 space-y-10 md:mt-8 md:space-y-9">
              {groupedCards.map((group) => (
                <>
                  <div
                    key={group.city}
                    className="mb-4 flex items-center gap-2"
                  >
                    <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                      Top stays in {group.city}
                    </h2>
                    <ChevronRight className="h-5 w-5 text-ink-700 " />
                  </div>

                  <div
                    key={group.city}
                    className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
                  >
                    {group.item.map((item, index) => {
                      return (
                        <Link
                          key={item.id}
                          className="block space-y-2"
                          href={buildingListingHref(item.id)}
                        >
                          <div className="overflow-hidden rounded-2xl ">
                            <SafeImage
                              src={item.image}
                              alt={item.title}
                              width={420}
                              height={280}
                              className="h-48 w-full object-cover"
                              priority={index < 4}
                            />
                          </div>
                          <div className="space-y-0.5 space-x-0.5">
                            <p className="inline-flex rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-700">
                              {item.city}
                            </p>
                            <p className="line-clamp-1 text-sm font-medium text-ink-900">
                              {item.title}
                            </p>
                            <p className="line-clamp-1 text-xs text-ink-500 ">
                              ${item.price} for 1 nights
                              <span className="ml-1 inline-flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-current text-ink-700" />
                                {item.rating}
                              </span>
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              ))}
            </section>
          ) : (
            <section className="mt-10 md:mt-8 ">
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                  Top picks across the United States
                </h2>
                <ChevronRight className="h-5 w-5 text-ink-700 " />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {defaultGridCards.map((item, index) => {
                  return (
                    <Link
                      key={item.id}
                      className="block space-y-2"
                      href={buildingListingHref(item.id)}
                    >
                      <div className="overflow-hidden rounded-2xl ">
                        <SafeImage
                          src={item.image}
                          alt={item.title}
                          width={420}
                          height={280}
                          className="h-48 w-full object-cover"
                          priority={index < 4}
                        />
                      </div>
                      <div className="space-y-0.5 space-x-0.5">
                        <p className="inline-flex rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-700">
                          {item.city}
                        </p>
                        <p className="line-clamp-1 text-sm font-medium text-ink-900">
                          {item.title}
                        </p>
                        <p className="line-clamp-1 text-xs text-ink-500 ">
                          ${item.price} for 1 nights
                          <span className="ml-1 inline-flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-current text-ink-700" />
                            {item.rating}
                          </span>
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      <footer className="mt-16 rounded-3xl border border-ink-200 bg-surface p-6 shadow-sm md:mt-14 md:p-7 ">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-semibold text-ink-900">StayScape</h3>
            <p className="mt-3 max-w-xl text-sm text-ink-600">
              Discover carefully curated US stays with the booking flow designed
              for clarity and confidence. Compare homes quickly and reserve with
              ease.
            </p>
            <p className="mt-5 inline-flex items-center gap-1 text-xs text-ink-500">
              <User className="h-3.5 w-3.5" />
              Powered by curated sample listing data focused on US destinations.
            </p>
          </div>

          <div className="">
            <h4 className="text-sm font-semibold text-ink-900">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li className="">City gateways</li>
              <li className="">Coastal retreats</li>
              <li className="">Cabin weekends</li>
              <li className="">Extended stays</li>
            </ul>
          </div>

          <div className="">
            <h4 className="text-sm font-semibold text-ink-900">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li className="">Guest help center</li>
              <li className="">Host guidelines</li>
              <li className="">Cancellation policy</li>
              <li className="">Trust and safety</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-ink-200 pt-4 text-xs text-ink-500">
          &copy; {new Date().getFullYear()} StayScape. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
