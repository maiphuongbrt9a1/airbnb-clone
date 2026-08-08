"use server";

import { requireUser } from "@/lib/auth";
import {
  MAX_INFANTS,
  MIN_ADULTS,
  PROCESSING_FEE_RATE,
} from "@/lib/booking-rules";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

/**
 * Schema for register
 */
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerUser(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error("Invalid registration input");
  }

  /**
   * Prevent duplicate email
   */
  const existing = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  if (existing) {
    throw new Error("Email has already existed");
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      hashedPassword: hashedPassword,
    },
  });

  redirect("/login");
}

const reservationSchema = z.object({
  listingId: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-zA-Z0-9_-]+$/),
  startDate: z.string(),
  endDate: z.string(),
  adults: z.coerce.number().int().min(MIN_ADULTS),
  children: z.coerce.number().min(0),
  infants: z.coerce.number().min(0).max(MAX_INFANTS),
});

function redirectWithBookingError(listingId: string, message: string) {
  redirect(
    `/listings/${listingId}?booking-error&message=${encodeURIComponent(message)}`,
  );
}

export async function createReservation(formData: FormData) {
  const user = await requireUser();
  const fallbackListingId = String(formData.get("listingId") ?? "");
  const parsed = reservationSchema.safeParse({
    listingId: formData.get("listingId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    adults: formData.get("adults"),
    children: formData.get("children"),
    infants: formData.get("infants"),
  });

  if (!parsed.success) {
    if (fallbackListingId) {
      redirectWithBookingError(
        fallbackListingId,
        "Please review your reservation details and try again.",
      );
    }
    redirect(
      "/bookings?message=Please review your reservation details and try again.",
    );
  }

  const startDate = new Date(parsed.data!.startDate);
  const endDate = new Date(parsed.data!.endDate);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    redirectWithBookingError(
      parsed.data!.listingId,
      "Please select valid check-in and check-out dates",
    );
  }

  if (endDate <= startDate) {
    redirectWithBookingError(
      parsed.data!.listingId,
      "Please check-out must be after check-in.",
    );
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id: parsed.data!.listingId,
    },
  });

  if (!listing) {
    redirectWithBookingError(parsed.data!.listingId, "Listing not found.");
  }

  const totalGuests =
    parsed.data!.adults + parsed.data!.children + parsed.data!.infants;

  if (totalGuests > listing!.guestCount) {
    redirectWithBookingError(
      parsed.data!.listingId,
      `This listing allows up to ${listing?.guestCount} guests. Please adjust your guest count.`,
    );
  }

  const overlappingReservation = await prisma.reservation.findFirst({
    where: {
      listingId: listing!.id,
      startDate: { lt: endDate },
      endDate: { gt: startDate },
    },
  });

  if (overlappingReservation) {
    redirectWithBookingError(
      listing!.id,
      "Selected dates are already booked. Please choose difference dates.",
    );
  }

  const nights = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
  );
  const subTotal = nights * listing!.pricePerNight;
  const processingFee = Math.round(subTotal * PROCESSING_FEE_RATE);
  const totalPrice = subTotal + processingFee;

  await prisma.reservation.create({
    data: {
      userId: user.id,
      listingId: listing!.id,
      startDate: startDate,
      endDate: endDate,
      totalPrice: totalPrice,
    },
  });

  revalidatePath("/bookings");
  revalidatePath(`/listings/${listing!.id}`);
  revalidatePath("/host");
  redirect(`/listings/${listing!.id}?booking=success`);
}
