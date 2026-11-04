import PropertyCard from "./PropertyCard";
import { filterFromSearchParams, getProperties } from "@/utils/propertyService";
import PropertyFilter from "./PropertyFilter";
import T from "./typography";

type PropertyListProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Server Component: hämtar listan från backend med filtret i URL:en.
 * Filtrering (G5), sortering (G8) och lediga datum (VG7) görs i backend.
 */
export default async function PropertyList({ searchParams }: PropertyListProps) {
  const filter = filterFromSearchParams(await searchParams);
  const { properties, error } = await getProperties(filter);
  const hasPeriod = !!(filter.check_in && filter.check_out);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <T.Header size="lg">Places to stay</T.Header>
        <PropertyFilter key={JSON.stringify(filter)} filter={filter} />
        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
      {!error && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-zinc-500">
            {properties.length} {properties.length === 1 ? "stay" : "stays"}
            {hasPeriod && ` available ${filter.check_in} – ${filter.check_out}`}
          </p>
          {properties.map((property) => (
            <PropertyCard key={property.property_id} property={property} />
          ))}
          {properties.length === 0 && (
            <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
              No stays match your search. Try changing the filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
