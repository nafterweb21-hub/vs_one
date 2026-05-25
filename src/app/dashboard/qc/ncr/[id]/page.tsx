import NcrForm from "../components/NcrForm";
import { getNcrFormData, getNcr } from "../actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditNcrPage({ params }: { params: { id: string } }) {
  const [formData, ncr] = await Promise.all([
    getNcrFormData(),
    getNcr(params.id)
  ]);

  if (!ncr) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/qc/ncr" className="text-gray-500 hover:text-gray-700">
            ← Back to List
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit NCR: {ncr.ncrNo}</h1>
        </div>
        
        <button type="button" onClick={() => {
            if (typeof window !== 'undefined') window.print();
        }} className="bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-200">
          🖨️ Print NCR
        </button>
      </div>
      
      <NcrForm formData={formData} initialData={ncr} />
    </div>
  );
}
