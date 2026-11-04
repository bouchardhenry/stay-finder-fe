"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange, Matcher } from "react-day-picker";
import { addDays, format, parseISO, startOfToday } from "date-fns";
import "react-day-picker/style.css";
import type { BookingDates } from "@/types/booking";

type BookingPickerProps = {
  value?: BookingDates;
  onChange: (dates: BookingDates | undefined) => void;
  /** Redan bokade perioder (från backend) – gråas ut i kalendern. */
  bookedDates?: BookingDates[];
};

export default function BookingPicker({ value, onChange, bookedDates = [] }: BookingPickerProps) {
  const [range, setRange] = useState<DateRange | undefined>(
    value ? { from: parseISO(value.check_in), to: parseISO(value.check_out) } : undefined,
  );

  // En bokning check_in–check_out upptar nätterna check_in .. check_out-1.
  const booked = useMemo<Matcher[]>(
    () =>
      bookedDates.map((dates) => ({
        from: parseISO(dates.check_in),
        to: addDays(parseISO(dates.check_out), -1),
      })),
    [bookedDates],
  );

  const onSelect = (next?: DateRange) => {
    setRange(next);
    if (next?.from && next?.to && next.to > next.from) {
      onChange({
        check_in: format(next.from, "yyyy-MM-dd"),
        check_out: format(next.to, "yyyy-MM-dd"),
      });
    } else {
      onChange(undefined);
    }
  };

  return (
    <DayPicker
      mode="range"
      selected={range}
      onSelect={onSelect}
      disabled={[{ before: startOfToday() }, ...booked]}
      excludeDisabled // en vald period kan inte gå över bokade datum
    />
  );
}
