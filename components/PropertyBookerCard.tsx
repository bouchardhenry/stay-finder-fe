"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { useAuth } from "@/contexts/auth";
import type { ApiErrorBody } from "@/types/api";
import type { BookingDates, NewBooking } from "@/types/booking";
import type { Property } from "@/types/property";
import { createBooking, formatPrice, nightsBetween } from "@/utils/bookingService";
import { getBookedDates } from "@/utils/propertyService";
import BookingPicker from "./BookingPicker";
import FieldError from "./FieldError";
import T from "./typography";
import { buttonClassName, cardClassName, fieldClassName } from "./styles";

type PropertyBookerCardProps = {
  property: Property;
  refreshKey: number;
  onBooked: () => void;
};

/** G9–G11: bokningsformulär med förhandsvisning av nätter och totalpris. */
export default function PropertyBookerCard({ property, refreshKey, onBooked }: PropertyBookerCardProps) {
  const { user } = useAuth();
  const [dates, setDates] = useState<BookingDates>();
  const [guests, setGuests] = useState("1");
  const [bookedDates, setBookedDates] = useState<BookingDates[]>([]);
  const [error, setError] = useState<ApiErrorBody | null>(null);
  const [success, setSuccess] = useState<string>();
  const [pending, setPending] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    getBookedDates(property.property_id).then(setBookedDates).catch(() => setBookedDates([]));
  }, [property.property_id, refreshKey]);

  // G11: visas INNAN man bokar. Det riktiga priset räknas och sparas av servern (VG6).
  const nights = dates ? nightsBetween(dates.check_in, dates.check_out) : 0;
  const total = nights * property.price_per_night;

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const booking: NewBooking = {
      guest_name: String(formData.get("guest_name") ?? "").trim(),
      guest_email: String(formData.get("guest_email") ?? "").trim(),
      check_in: dates?.check_in ?? "",
      check_out: dates?.check_out ?? "",
      guests: Number(guests),
    };
    setError(null);
    setSuccess(undefined);
    setPending(true);
    try {
      const result = await createBooking(property.property_id, booking);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(
        `Booked ${result.data.check_in} – ${result.data.check_out} for ${formatPrice(result.data.total_price)}. The host will confirm it.`,
      );
      setDates(undefined);
      setFormKey((key) => key + 1);
      onBooked();
    } catch {
      setError({ message: "Could not reach the server" });
    } finally {
      setPending(false);
    }
  };

  const dateError = error?.errors?.check_in ?? error?.errors?.check_out;

  return (
    <form key={formKey} onSubmit={onSubmit} className={`${cardClassName} flex flex-col gap-4`} noValidate>
      <T.Header size="md">Book this stay</T.Header>
      <div className="flex flex-col gap-1">
        <BookingPicker value={dates} onChange={setDates} bookedDates={bookedDates} />
        <FieldError message={dateError} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          Guests
          <input
            name="guests"
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className={fieldClassName}
          />
          <span className="text-xs text-zinc-500">Max {property.max_guests}</span>
          <FieldError message={error?.errors?.guests} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input name="guest_name" autoComplete="name" className={fieldClassName} />
          <FieldError message={error?.errors?.guest_name} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            name="guest_email"
            type="email"
            autoComplete="email"
            defaultValue={user?.email}
            className={fieldClassName}
          />
          <FieldError message={error?.errors?.guest_email} />
        </label>
      </div>

      <dl className="flex flex-col gap-1 rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900" aria-live="polite">
        {dates ? (
          <>
            <div className="flex justify-between">
              <dt className="text-zinc-500">
                {dates.check_in} → {dates.check_out}
              </dt>
            </div>
            <div className="flex justify-between">
              <dt>
                {formatPrice(property.price_per_night)} × {nights} {nights === 1 ? "night" : "nights"}
              </dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-2 font-semibold dark:border-zinc-800">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </>
        ) : (
          <dt className="text-zinc-500">Choose check-in and check-out in the calendar.</dt>
        )}
      </dl>

      {error && !error.errors && <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>}
      {error?.errors && (
        <p className="text-sm text-red-600 dark:text-red-400">Please fix the highlighted fields.</p>
      )}
      {success && <p className="text-sm text-green-700 dark:text-green-400">{success}</p>}
      <button type="submit" disabled={pending} className={buttonClassName}>
        {pending ? "Booking…" : "Book"}
      </button>
    </form>
  );
}
