import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PoSubconForm from "@/components/purchase/PoSubconForm";

export default async function PoSubconDetailPage({ params }: { params: { id: string } }) {
  const po = await prisma.purchaseOrderSubcon.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!po) return notFound();

  // For this generic page, if it's draft/rejected we can edit, otherwise view.
  const isEditable = po.status === "Draft" || po.status === "Rejected";

  return <PoSubconForm initialData={po} mode={isEditable ? "edit" : "view"} />;
}
