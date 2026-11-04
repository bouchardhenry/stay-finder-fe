import type { Database } from "./database.types";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];

export type PropertyKind = "apartment" | "villa";
export type PropertySort = "price_asc" | "price_desc";

export type Property = Omit<PropertyRow, "kind"> & { kind: PropertyKind };

export type PropertyInput = Pick<
  Property,
  "title" | "description" | "location" | "price_per_night" | "max_guests" | "kind"
>;

export type PropertyValidKey = keyof Property;
