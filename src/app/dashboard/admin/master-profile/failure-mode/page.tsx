import { getFailureModes } from "./actions";
import FailureModeClient from "./failure-mode-client";

export default async function FailureModeProfilePage() {
  const failureModes = await getFailureModes();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="flex-1 p-6 overflow-y-auto">
        <FailureModeClient initialData={failureModes} />
      </main>
    </div>
  );
}
