import {
  Bath,
  BedDouble,
  MapPin,
  Pencil,
  Trash2,
  User2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { SafeImage } from "../safe-image";

type HostListingItemProps = {
  listing: {
    id: string;
    title: string;
    description: string;
    locationValue: string;
    imageSrc: string;
    pricePerNight: number;
    category: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
  };
  index: number;
};

export function HostListingItem({ listing, index }: HostListingItemProps) {
  return (
    <article
      className="host-listing-card rounded-3xl border border-ink-200 bg-surface p-4 shadow-sm transition hover:shadow-md md:p-5 "
      style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
    >
      <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] md:gap-5">
        <Link
          href={`/listings/${listing.id}`}
          className="overflow-hidden rounded-2xl border border-ink-200 "
        >
          <SafeImage
            src={listing.imageSrc}
            alt={listing.title}
            width={640}
            height={420}
            className="h-full min-h-44 w-full object-cover"
          ></SafeImage>
        </Link>
        <Link href={`/listings/${listing.id}`} className="min-w-0">
          <p className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold">
            {listing.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold leading-tight text-ink-900 ">
            {listing.title}
          </h3>
          <p className="mt-2 inline-flex items-center gap-1.5 text-[0.8rem] text-ink-600 md:text-[0.9rem]">
            <MapPin className="h-4 w-4" />
            {listing.locationValue}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-600 ">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-ink-500" />
              {listing.guestCount}
            </span>
            <span className=""></span>
          </div>
        </Link>
      </div>
    </article>
  );
}
