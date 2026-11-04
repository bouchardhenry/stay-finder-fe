import type { Booking, BookingUpdate, BookingWithProperty, NewBooking } from "@/types/booking";
import { apiFetch, jsonBody } from "./api";

export function getBookingsForProperty(propertyId: string) {
  return apiFetch<Booking[]>(`/bookings/properties/${propertyId}`);
}

export function getMyBookings() {
  return apiFetch<BookingWithProperty[]>("/bookings/me");
}

export function createBooking(propertyId: string, booking: NewBooking) {
  return apiFetch<Booking>(`/bookings/properties/${propertyId}`, { method: "POST", ...jsonBody(booking) });
}

export function updateBooking(propertyId: string, bookingId: string, changes: BookingUpdate) {
  return apiFetch<Booking>(`/bookings/properties/${propertyId}/${bookingId}`, {
    method: "PATCH",
    ...jsonBody(changes),
  });
}

export function deleteBooking(propertyId: string, bookingId: string) {
  return apiFetch<null>(`/bookings/properties/${propertyId}/${bookingId}`, { method: "DELETE" });
}

/** Antal nätter mellan två YYYY-MM-DD-datum (för förhandsvisning – servern räknar det riktiga priset). */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`);
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("sv-SE")} kr`;
}
