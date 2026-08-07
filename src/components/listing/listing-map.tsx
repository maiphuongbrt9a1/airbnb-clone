type ListingMapProps = {
  locationValue: string;
};

export function ListingMap({ locationValue }: ListingMapProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-ink-200 bg-gradient-to-br from-ink-50 via-surface to-ink-50 p-4 shadow-sm md:p-6 ">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between ">
        <div className="max-w-md space-y-2">
          <h2 className="text-lg font-semibold text-ink-900 md:text-xl ">
            Where you will be
          </h2>
          <p className="text-sm text-ink-600">
            {locationValue}. The map pin is approximate and shown for the trip
            planing.
          </p>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-ink-200 ">
        <iframe
          title={`Map for the ${locationValue}`}
          src={`https://www.google.com/maps?hl=en&q=${encodeURIComponent(locationValue)}&z=14&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-72 w-full border-0 md:h-80 "
        ></iframe>
      </div>
    </section>
  );
}
