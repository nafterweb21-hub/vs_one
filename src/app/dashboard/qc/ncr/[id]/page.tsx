import NcrForm from "../components/NcrForm";

export default function EditNcrPage({ params }: { params: { id: string } }) {
  return <NcrForm ncrId={params.id} />;
}
