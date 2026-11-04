"use client";

import { useState } from "react";
import type { Property } from "@/types/property";
import AuthGate from "./AuthGate";
import PropertyBookerCard from "./PropertyBookerCard";
import PropertyBookings from "./PropertyBookings";

/**
 * Bokningsdelen av detaljsidan.
 * refreshKey ökas när något ändras, så att kalendern och listan hämtas om.
 */
export default function PropertyBookingSection({ property }: { property: Property }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((key) => key + 1);

  return (
    <section className="flex flex-col gap-6">
      {/* G9: utloggad besökare uppmanas att logga in */}
      <AuthGate message="Log in to book this stay.">
        <PropertyBookerCard property={property} refreshKey={refreshKey} onBooked={refresh} />
        <PropertyBookings property={property} refreshKey={refreshKey} onChanged={refresh} />
      </AuthGate>
    </section>
  );
}
