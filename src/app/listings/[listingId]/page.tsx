import { getCurrentUser } from "@/lib/auth";
import { fetchDemoProperties } from "@/lib/demo-properties";
import { prisma } from "@/lib/prisma";
import { syncDemoListingById } from "@/lib/sync-demo-listings";
import { notFound } from "next/navigation";

type ListingPageProps = {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<{
    booking?: string;
    message?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    infants?: string;
  }>;
};

export default async function ListingPage({
  params,
  searchParams,
}: ListingPageProps) {
  const { listingId } = await params;
  const query = await searchParams;
  const demoProperties = await fetchDemoProperties();
  const demoListingSeed = demoProperties.find(
    (property) => property.id === listingId,
  );

  const dbListing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      user: true,
    },
  });

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-28 pt-5 md:px-8 md:pb-10 md:pt-8">
      <article className="space-y-6 md:space-y-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-start">
          <div className="order-2 space-y-6 md:space-y-7 lg:order-1">
            <section className="">
              {/* <ListingImageGallery/> */}
              <p className="">ListingImageGallery</p>
              {/* <ListingHeaderInfo /> */}
              <p className="">ListingHeaderInfo</p>
            </section>
            {/* <ListingAbout/> */}
            <p className="">ListingAbout</p>
            {/* <ListingBookedRanges/> */}
            <p className="">ListingBookedRanges</p>
            {/* <ListingMap/> */}
            <p className="">ListingMap</p>
          </div>

          <div className="order-1 lg:order-2">
            {/* <ListingBookingSidebar /> */}
            <p className="">ListingBookingSidebar</p>
          </div>
        </div>
      </article>
    </main>
  );
}
