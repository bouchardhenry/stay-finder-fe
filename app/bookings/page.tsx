import T from "@/components/typography";
import AuthGate from "@/components/AuthGate";
import MyBookings from "@/components/MyBookings";

export default function MyBookingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <T.Header size="lg">My bookings</T.Header>
      <AuthGate>
        <MyBookings />
      </AuthGate>
    </main>
  );
}
