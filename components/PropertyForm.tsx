"use client";

import { useState, type SubmitEvent } from "react";
import type { ApiErrorBody } from "@/types/api";
import type { Property, PropertyInput } from "@/types/property";
import { propertyFromForm } from "@/utils/propertyService";
import FieldError from "./FieldError";
import { buttonClassName, fieldClassName } from "./styles";

type PropertyFormProps = {
  /** Returnerar null om det gick bra, annars felet från API:t. */
  action: (property: PropertyInput) => Promise<ApiErrorBody | null>;
  values?: Partial<Property>;
  submitLabel?: string;
  pendingLabel?: string;
};

export default function PropertyForm({
  action,
  values,
  submitLabel = "Create stay",
  pendingLabel = "Saving…",
}: PropertyFormProps) {
  const [error, setError] = useState<ApiErrorBody | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const property = propertyFromForm(new FormData(event.currentTarget));
    setError(null);
    setPending(true);
    try {
      setError(await action(property));
    } catch {
      setError({ message: "Could not reach the server" });
    } finally {
      setPending(false);
    }
  }

  const fieldError = (name: keyof PropertyInput) => <FieldError message={error?.errors?.[name]} />;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <label className="flex flex-col gap-1 text-sm">
        Title
        <input name="title" required defaultValue={values?.title} className={fieldClassName} />
        {fieldError("title")}
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea name="description" required rows={4} defaultValue={values?.description} className={fieldClassName} />
        {fieldError("description")}
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Location
        <input name="location" required defaultValue={values?.location} className={fieldClassName} />
        {fieldError("location")}
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Kind
        <select name="kind" required defaultValue={values?.kind ?? ""} className={fieldClassName}>
          <option value="" disabled>
            Choose a kind
          </option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
        </select>
        {fieldError("kind")}
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Max guests
          <input
            name="max_guests"
            type="number"
            min={1}
            required
            defaultValue={values?.max_guests}
            className={fieldClassName}
          />
          {fieldError("max_guests")}
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Price per night (kr)
          <input
            name="price_per_night"
            type="number"
            min={100}
            required
            defaultValue={values?.price_per_night}
            className={fieldClassName}
          />
          {fieldError("price_per_night")}
        </label>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>}
      <button type="submit" disabled={pending} className={buttonClassName}>
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
