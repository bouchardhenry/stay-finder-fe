"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import type { Property } from "@/types/property";
import { deleteProperty } from "@/utils/propertyService";
import { dangerButtonClassName, secondaryButtonClassName } from "./styles";

/** Knapparna visas bara för ägaren. Själva skyddet ligger i API:t (403) och databasen (RLS). */
export default function OwnerPropertyActions({ property }: { property: Property }) {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  if (!user || user.id !== property.user_id) return null;

  const onDelete = async () => {
    if (!window.confirm(`Delete "${property.title}"? All its bookings are removed too.`)) return;
    setPending(true);
    const result = await deleteProperty(property.property_id);
    setPending(false);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <Link href={`/host/properties/${property.property_id}/edit`} className={secondaryButtonClassName}>
          Edit
        </Link>
        <button type="button" onClick={onDelete} disabled={pending} className={dangerButtonClassName}>
          Delete
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
