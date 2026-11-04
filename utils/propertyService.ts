import type { BookingDates } from "@/types/booking";
import type { Property, PropertyInput, PropertyKind, PropertySort } from "@/types/property";
import { apiFetch, jsonBody } from "./api";

export type PropertiesFilter = {
  location?: string;
  maxprice?: string;
  guests?: string;
  sort?: PropertySort | "";
  check_in?: string;
  check_out?: string;
};

export const FILTER_KEYS = ["location", "maxprice", "guests", "sort", "check_in", "check_out"] as const;

/** Läser filtret från URL:ens search params (så filtret går att dela/ladda om). */
export function filterFromSearchParams(params: Record<string, string | string[] | undefined>): PropertiesFilter {
  const filter: PropertiesFilter = {};
  for (const key of FILTER_KEYS) {
    const value = params[key];
    if (typeof value === "string" && value) {
      (filter as Record<string, string>)[key] = value;
    }
  }
  return filter;
}

export function filterToQuery(filter: PropertiesFilter): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filter[key];
    if (value) params.set(key, value);
  }
  return params.toString();
}

/**
 * Hämtar listan. Filtrering och sortering görs i backend.
 * - 400 (t.ex. ogiltig period) returneras som { error } och visas vid filtret.
 * - Nätverksfel / 500 kastas, så att app/error.tsx visar felvyn.
 */
export async function getProperties(
  filter: PropertiesFilter = {},
): Promise<{ properties: Property[]; error?: undefined } | { properties: []; error: string }> {
  const query = filterToQuery(filter);
  const result = await apiFetch<Property[]>(`/properties${query ? `?${query}` : ""}`);
  if (result.ok) {
    return { properties: result.data };
  }
  if (result.status === 400) {
    const details = Object.values(result.error.errors ?? {});
    return { properties: [], error: details.length ? details.join(". ") : result.error.message };
  }
  throw new Error(`Could not load stays (${result.status})`);
}

/** null = finns inte (404). Andra fel kastas → felvyn. */
export async function getPropertyById(id: string): Promise<Property | null> {
  const result = await apiFetch<Property>(`/properties/${encodeURIComponent(id)}`);
  if (result.ok) return result.data;
  if (result.status === 404) return null;
  throw new Error(`Could not load the stay (${result.status})`);
}

export async function getBookedDates(id: string): Promise<BookingDates[]> {
  const result = await apiFetch<BookingDates[]>(`/properties/${encodeURIComponent(id)}/booked-dates`);
  return result.ok ? result.data : [];
}

const kinds: PropertyKind[] = ["apartment", "villa"];

/** Läser formuläret till rätt typ. Validering av värdena görs i backend. */
export function propertyFromForm(formData: FormData): PropertyInput {
  const kind = String(formData.get("kind") ?? "");
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    kind: kinds.includes(kind as PropertyKind) ? (kind as PropertyKind) : ("" as PropertyKind),
    max_guests: Number(formData.get("max_guests")),
    price_per_night: Number(formData.get("price_per_night")),
  };
}

export function createProperty(property: PropertyInput) {
  return apiFetch<Property>("/properties", { method: "POST", ...jsonBody(property) });
}

export function updateProperty(id: string, property: Partial<PropertyInput>) {
  return apiFetch<Property>(`/properties/${id}`, { method: "PATCH", ...jsonBody(property) });
}

export function deleteProperty(id: string) {
  return apiFetch<null>(`/properties/${id}`, { method: "DELETE" });
}
