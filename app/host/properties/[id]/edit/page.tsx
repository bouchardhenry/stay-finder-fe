import { notFound } from "next/navigation";
import T from "@/components/typography";
import EditPropertyForm from "@/components/EditPropertyForm";
import { getPropertyById } from "@/utils/propertyService";

export default async function EditPropertyPage({ params }: PageProps<"/host/properties/[id]/edit">) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <T.Header size="lg">Edit {property.title}</T.Header>
      <EditPropertyForm property={property} />
    </main>
  );
}
