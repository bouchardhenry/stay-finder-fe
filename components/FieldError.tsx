/** Visar ett felmeddelande under ett formulärfält (G10). */
export default function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span role="alert" className="text-sm text-red-600 dark:text-red-400">
      {message}
    </span>
  );
}
