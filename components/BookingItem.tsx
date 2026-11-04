"use client";

import { useState, type SubmitEvent } from "react";
import { useAuth } from "@/contexts/auth";
import type { ApiErrorBody } from "@/types/api";
import type { Booking, BookingStatus, BookingUpdate } from "@/types/booking";
import { deleteBooking, formatPrice, nightsBetween, updateBooking } from "@/utils/bookingService";
import FieldError from "./FieldError";
import { cn } from "@/utils/cn";
import {
  buttonClassName,
  cardClassName,
  dangerButtonClassName,
  fieldClassName,
  secondaryButtonClassName,
} from "./styles";

type BookingItemProps = {
  booking: Booking;
  /** Behövs för att veta om användaren är ägare. Saknas på "Mina bokningar". */
  property?: { property_id: string; user_id?: string; price_per_night?: number };
  onChanged: () => void;
};

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  cancelled: "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * En bokning med knappar för det användaren får göra.
 * Knapparna är bara bekvämlighet – reglerna (VG1, VG4, VG5) kontrolleras i
 * API:t och databasen, och deras fel visas här om något nekas.
 */
export default function BookingItem({ booking, property, onChanged }: BookingItemProps) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<ApiErrorBody | null>(null);
  const [pending, setPending] = useState(false);

  const propertyId = booking.property_id;
  const isGuest = user?.id === booking.user_id;
  const isOwner = !!property?.user_id && user?.id === property.user_id;
  const started = booking.check_in < today();
  const active = booking.status !== "cancelled" && !started;

  const run = async (action: () => Promise<{ ok: boolean; error?: ApiErrorBody }>) => {
    setError(null);
    setPending(true);
    try {
      const result = await action();
      if (!result.ok) {
        setError(result.error ?? { message: "Something went wrong" });
        return false;
      }
      onChanged();
      return true;
    } catch {
      setError({ message: "Could not reach the server" });
      return false;
    } finally {
      setPending(false);
    }
  };

  const setStatus = (status: BookingStatus) => run(() => updateBooking(propertyId, booking.booking_id, { status }));

  const onDelete = () => {
    if (window.confirm("Delete this booking?")) run(() => deleteBooking(propertyId, booking.booking_id));
  };

  const onSave = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const changes: BookingUpdate = {
      check_in: String(formData.get("check_in")),
      check_out: String(formData.get("check_out")),
      guests: Number(formData.get("guests")),
      guest_name: String(formData.get("guest_name")).trim(),
      guest_email: String(formData.get("guest_email")).trim(),
    };
    if (await run(() => updateBooking(propertyId, booking.booking_id, changes))) {
      setEditing(false);
    }
  };

  const nights = nightsBetween(booking.check_in, booking.check_out);

  return (
    <div className={cn(cardClassName, "flex flex-col gap-3 text-sm")}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium">
            {booking.check_in} → {booking.check_out}{" "}
            <span className="font-normal text-zinc-500">
              ({nights} {nights === 1 ? "night" : "nights"}, {booking.guests}{" "}
              {booking.guests === 1 ? "guest" : "guests"})
            </span>
          </p>
          <p className="text-zinc-500">
            {booking.guest_name} · {booking.guest_email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formatPrice(booking.total_price)}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", statusStyles[booking.status])}>
            {booking.status}
          </span>
        </div>
      </div>

      {started && booking.status !== "cancelled" && (
        <p className="text-xs text-zinc-500">Check-in has passed, so this booking can no longer be changed.</p>
      )}

      {editing ? (
        <form onSubmit={onSave} className="grid gap-3 sm:grid-cols-2" noValidate>
          <label className="flex flex-col gap-1">
            Check-in
            <input type="date" name="check_in" defaultValue={booking.check_in} className={fieldClassName} />
            <FieldError message={error?.errors?.check_in} />
          </label>
          <label className="flex flex-col gap-1">
            Check-out
            <input type="date" name="check_out" defaultValue={booking.check_out} className={fieldClassName} />
            <FieldError message={error?.errors?.check_out} />
          </label>
          <label className="flex flex-col gap-1">
            Guests
            <input type="number" name="guests" min={1} defaultValue={booking.guests} className={fieldClassName} />
            <FieldError message={error?.errors?.guests} />
          </label>
          <label className="flex flex-col gap-1">
            Name
            <input name="guest_name" defaultValue={booking.guest_name} className={fieldClassName} />
            <FieldError message={error?.errors?.guest_name} />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            Email
            <input type="email" name="guest_email" defaultValue={booking.guest_email} className={fieldClassName} />
            <FieldError message={error?.errors?.guest_email} />
          </label>
          <p className="text-xs text-zinc-500 sm:col-span-2">
            If you change the dates, the server recalculates the total price.
          </p>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={pending} className={buttonClassName}>
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              className={secondaryButtonClassName}
            >
              Close
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap gap-2">
          {isGuest && active && (
            <button type="button" onClick={() => setEditing(true)} className={secondaryButtonClassName}>
              Edit
            </button>
          )}
          {isOwner && active && booking.status === "pending" && (
            <button type="button" disabled={pending} onClick={() => setStatus("confirmed")} className={buttonClassName}>
              Confirm
            </button>
          )}
          {(isGuest || isOwner) && active && (
            <button
              type="button"
              disabled={pending}
              onClick={() => setStatus("cancelled")}
              className={secondaryButtonClassName}
            >
              Cancel booking
            </button>
          )}
          {(isGuest || isOwner) && (booking.status === "cancelled" || !started) && (
            <button type="button" disabled={pending} onClick={onDelete} className={dangerButtonClassName}>
              Delete
            </button>
          )}
        </div>
      )}

      {error && (!error.errors || !editing) && (
        <p role="alert" className="text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
}
