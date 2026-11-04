"use client";

import { useRouter } from "next/navigation";
import AuthGate from "@/components/AuthGate";
import PropertyForm from "@/components/PropertyForm";
import T from "@/components/typography";
import { createProperty } from "@/utils/propertyService";
import type { PropertyInput } from "@/types/property";

/** G7: en inloggad användare skapar ett boende via formuläret. */
export default function NewPropertyPage() {
  const router = useRouter();

  async function onCreate(property: PropertyInput) {
    const result = await createProperty(property);
    if (!result.ok) return result.error;
    router.push(`/properties/${result.data.property_id}`);
    return null;
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <T.Header size="lg">List a stay</T.Header>
      <AuthGate>
        <PropertyForm action={onCreate} />
      </AuthGate>
    </main>
  );
}
