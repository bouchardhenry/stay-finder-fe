"use client";

import type { SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { filterToQuery, FILTER_KEYS, type PropertiesFilter } from "@/utils/propertyService";
import { buttonClassName, fieldClassName } from "./styles";

type PropertyFilterProps = {
  filter: PropertiesFilter;
};

/**
 * Filtret läggs i URL:en (?location=...&sort=...). Sidan (server component)
 * läser URL:en och hämtar listan igen från backend. Då går det att ladda om
 * eller dela en sökning.
 */
export default function PropertyFilter({ filter }: PropertyFilterProps) {
  const router = useRouter();

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const next: PropertiesFilter = {};
    for (const key of FILTER_KEYS) {
      const value = String(formData.get(key) ?? "").trim();
      if (value) (next as Record<string, string>)[key] = value;
    }
    const query = filterToQuery(next);
    router.push(query ? `/?${query}` : "/");
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3 sm:grid-cols-6">
      <label className="col-span-2 flex flex-col gap-1 text-xs text-zinc-500 sm:col-span-6">
        Location
        <input
          type="search"
          name="location"
          defaultValue={filter.location}
          placeholder="e.g. Stockholm"
          className={fieldClassName}
        />
      </label>
      <label className="col-span-1 flex flex-col gap-1 text-xs text-zinc-500 sm:col-span-2">
        Max price / night
        <input type="number" name="maxprice" min={1} defaultValue={filter.maxprice} className={fieldClassName} />
      </label>
      <label className="col-span-1 flex flex-col gap-1 text-xs text-zinc-500 sm:col-span-2">
        Guests
        <input type="number" name="guests" min={1} defaultValue={filter.guests} className={fieldClassName} />
      </label>
      <label className="col-span-2 flex flex-col gap-1 text-xs text-zinc-500 sm:col-span-2">
        Sort by price
        <select name="sort" defaultValue={filter.sort ?? ""} className={fieldClassName}>
          <option value="">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </label>
      <label className="col-span-1 flex flex-col gap-1 text-xs text-zinc-500 sm:col-span-2">
        Check-in
        <input type="date" name="check_in" defaultValue={filter.check_in} className={fieldClassName} />
      </label>
      <label className="col-span-1 flex flex-col gap-1 text-xs text-zinc-500 sm:col-span-2">
        Check-out
        <input type="date" name="check_out" defaultValue={filter.check_out} className={fieldClassName} />
      </label>
      <div className="col-span-2 flex items-end gap-2 sm:col-span-2">
        <button type="submit" className={buttonClassName}>
          Search
        </button>
        <button type="button" onClick={() => router.push("/")} className="px-2 py-2 text-sm underline">
          Clear
        </button>
      </div>
    </form>
  );
}
