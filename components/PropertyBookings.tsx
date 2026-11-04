"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import type { Booking } from "@/types/booking";
import type { Property } from "@/types/property";
import { getBookingsForProperty } from "@/utils/bookingService";
import BookingItem from "./BookingItem";
import T from "./typography";

type PropertyBookingsProps = {
  property: Property;
  refreshKey: number;
  onChanged: () => void;
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; bookings: Booking[] };

/**
 * G12: bokningar för boendet. Vilka som syns bestäms av backend/databasen (VG1):
 * gästen ser sina egna, ägaren ser alla.
 */
export default function PropertyBookings({ property, refreshKey, onChanged }: PropertyBookingsProps) {
  const { user } = useAuth();
  const [state, setState] = useState<State>({ status: "loading" });
  const isOwner = user?.id === property.user_id;

  useEffect(() => {
    let cancelled = false;
    getBookingsForProperty(property.property_id)
      .then((result) => {
        if (cancelled) return;
        setState(
          result.ok ? { status: "done", bookings: result.data } : { status: "error", message: result.error.message },
        );
      })
      .catch(() => !cancelled && setState({ status: "error", message: "Could not reach the server" }));
    return () => {
      cancelled = true;
    };
  }, [property.property_id, refreshKey, user?.id]);

  return (
    <div className="flex flex-col gap-3">
      <T.Header size="md">{isOwner ? "Bookings for your stay" : "Your bookings here"}</T.Header>
      {state.status === "loading" && <p className="text-sm text-zinc-500">Loading bookings…</p>}
      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          Could not load bookings: {state.message}
        </p>
      )}
      {state.status === "done" && state.bookings.length === 0 && (
        <p className="text-sm text-zinc-500">No bookings yet.</p>
      )}
      {state.status === "done" &&
        state.bookings.map((booking) => (
          <BookingItem key={booking.booking_id} booking={booking} property={property} onChanged={onChanged} />
        ))}
    </div>
  );
}
