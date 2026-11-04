"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BookingWithProperty } from "@/types/booking";
import { getMyBookings } from "@/utils/bookingService";
import BookingItem from "./BookingItem";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; bookings: BookingWithProperty[] };

export default function MyBookings() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getMyBookings()
      .then((result) =>
        setState(result.ok ? { status: "done", bookings: result.data } : { status: "error", message: result.error.message }),
      )
      .catch(() => setState({ status: "error", message: "Could not reach the server" }));
  }, [refreshKey]);

  if (state.status === "loading") return <p className="text-sm text-zinc-500">Loading bookings…</p>;
  if (state.status === "error")
    return (
      <p role="alert" className="text-sm text-red-600">
        Could not load your bookings: {state.message}
      </p>
    );
  if (state.bookings.length === 0)
    return (
      <p className="text-sm text-zinc-500">
        You have no bookings yet. <Link href="/" className="underline">Find a stay</Link>
      </p>
    );

  return (
    <div className="flex flex-col gap-4">
      {state.bookings.map((booking) => (
        <div key={booking.booking_id} className="flex flex-col gap-2">
          {booking.property && (
            <Link href={`/properties/${booking.property.property_id}`} className="font-medium hover:underline">
              {booking.property.title}
              <span className="font-normal text-zinc-500"> · {booking.property.location}</span>
            </Link>
          )}
          <BookingItem booking={booking} onChanged={() => setRefreshKey((k) => k + 1)} />
        </div>
      ))}
    </div>
  );
}
