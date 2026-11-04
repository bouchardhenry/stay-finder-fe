"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import type { Property, PropertyInput } from "@/types/property";
import { updateProperty } from "@/utils/propertyService";
import AuthGate from "./AuthGate";
import PropertyForm from "./PropertyForm";

export default function EditPropertyForm({ property }: { property: Property }) {
  const router = useRouter();
  const { user } = useAuth();

  async function onSave(input: PropertyInput) {
    const result = await updateProperty(property.property_id, input);
    if (!result.ok) return result.error;
    router.push(`/properties/${property.property_id}`);
    router.refresh();
    return null;
  }

  return (
    <AuthGate>
      {user && user.id !== property.user_id ? (
        // Bara en hjälp i gränssnittet – API:t och databasen nekar ändå (403 / RLS).
        <p className="text-sm text-red-600">Only the owner can edit this stay.</p>
      ) : (
        <PropertyForm action={onSave} values={property} submitLabel="Save changes" />
      )}
    </AuthGate>
  );
}
