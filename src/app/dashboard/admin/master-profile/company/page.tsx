import { getCompanies } from "./actions";
import CompanyClient from "./company-client";

export default async function CompanyProfilePage() {
  const companies = await getCompanies();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="flex-1 p-6 overflow-y-auto">
        <CompanyClient initialData={companies} />
      </main>
    </div>
  );
}
