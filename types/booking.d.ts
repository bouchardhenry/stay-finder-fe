import type { Database } from "./database.types";

type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = Omit<BookingRow, "status"> & { status: BookingStatus };

/** Det formuläret skickar när en bokning skapas. Pris och status sätts av servern. */
export type NewBooking = Pick<Booking, "guest_name" | "guest_email" | "check_in" | "check_out" | "guests">;

export type BookingUpdate = Partial<NewBooking & Pick<Booking, "status">>;

export type BookingWithProperty = Booking & {
  property: { property_id: string; title: string; location: string } | null;
};

export type BookingDates = Pick<Booking, "check_in" | "check_out">;
