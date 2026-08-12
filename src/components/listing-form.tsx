"use client";

import { ImageUp } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { SafeImage } from "./safe-image";

type ListingFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
  submittingLabel?: string;
  initialValue?: {
    title: string;
    category: string;
    description: string;
    locationValue: string;
    pricePerNight: number;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    imageSrc: string;
    imageGallery: string[];
  };
};

type FieldInputProps = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  min?: number;
  defaultValue?: string | number;
};

type FieldTextareaProps = {
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  defaultValue?: string;
};

export function FieldTextarea({
  name,
  label,
  placeholder,
  className,
  defaultValue,
}: FieldTextareaProps) {
  return (
    <label className={`grid gap-1.5 ${className ?? ""}`}>
      <span className="text-xs font-medium text-ink-600 ">{label}</span>
      <textarea
        name={name}
        required
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={4}
        className="rounded-xl border border-ink-300 px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      ></textarea>
    </label>
  );
}

export function FieldInput({
  name,
  label,
  placeholder,
  type = "text",
  min,
  defaultValue,
}: FieldInputProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium text-ink-600 ">{label}</span>
      <input
        name={name}
        required
        type={type}
        min={min}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="rounded-xl border border-ink-300 px-3 py-2 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}

export function SubmitButton({
  submitLabel,
  submittingLabel,
}: {
  submitLabel: string;
  submittingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
    >
      {pending ? submittingLabel : submitLabel}
    </button>
  );
}

export function ListingForm({
  action,
  submitLabel = "Publish listing",
  submittingLabel = "Publishing...",
  initialValue,
}: ListingFormProps) {
  const [galleryImage, setGalleryImage] = useState<string[]>(
    initialValue
      ? Array.from(
          new Set(
            [
              ...(initialValue.imageGallery ?? []),
              ...(initialValue.imageSrc ? [initialValue.imageSrc] : []),
            ].filter(Boolean),
          ),
        ).slice(0, 10)
      : [],
  );

  const [uploadError, setUploadError] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);

  return (
    <form action="" className="mt-4 grid gap-3 md:grid-cols-2">
      <FieldInput
        name="title"
        label="Title"
        placeholder="Stylish loft near downtown"
        defaultValue={initialValue?.title}
      />
      <FieldInput
        name="category"
        label="Category"
        placeholder="Apart, villa, cabin, ....."
        defaultValue={initialValue?.category}
      />

      <div className="rounded-2xl border border-ink-200 bg-surface-muted/40 p-3 md:col-span-2 md:p-4">
        <p className="mb-2 text-sm font-medium text-ink-800 ">
          Listing Gallery
        </p>
        <label
          className={`flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 text-center transition ${isDragActive ? "border-brand-400 bg-brand-50/40 " : "border-ink-300 bg-surface hover:border-brand-300"}`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={(event) => setIsDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragActive(false);
          }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              event.currentTarget.value = "";
            }}
          />
          <ImageUp className="h-6 w-6 text-brand-500" />
          <p className="text-sm font-semibold text-ink-800 ">
            Drag and drop images, or click to upload.
          </p>
          <p className="text-xs text-ink-500">Up to 10 images, each max 4MB.</p>
        </label>

        <input
          name="imageSrc"
          value={galleryImage[0] ?? ""}
          readOnly
          required
          hidden
          className=""
        />

        <input
          name="imageGallery"
          value={JSON.stringify(galleryImage)}
          readOnly
          hidden
          className=""
        />

        {/* Drop zone for image */}
      </div>

      <FieldTextarea
        name="description"
        label="Description"
        placeholder="Describe what guest can expect from this stay."
        defaultValue={initialValue?.description}
        className="md:col-span-2"
      />

      <FieldInput
        name="locationValue"
        label="Location"
        placeholder="e.g. Miami, United States"
        defaultValue={initialValue?.locationValue}
      />

      <FieldInput
        name="pricePerNight"
        label="Price per night"
        type="number"
        min={10}
        placeholder="250"
        defaultValue={initialValue?.pricePerNight}
      />

      <FieldInput
        name="guestCount"
        label="Guests"
        type="number"
        min={1}
        placeholder="4"
        defaultValue={initialValue?.guestCount}
      />
      <FieldInput
        name="roomCount"
        label="Rooms"
        type="number"
        min={1}
        placeholder="4"
        defaultValue={initialValue?.roomCount}
      />
      <FieldInput
        name="bathroomCount"
        label="Bathrooms"
        type="number"
        min={1}
        placeholder="4"
        defaultValue={initialValue?.bathroomCount}
      />

      <SubmitButton
        submitLabel={submitLabel}
        submittingLabel={submittingLabel}
      />
    </form>
  );
}
