import { getJoints } from "./actions";
import JointClient from "./joint-client";

export default async function JointProfilePage() {
  const joints = await getJoints();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="flex-1 p-6 overflow-y-auto">
        <JointClient initialData={joints} />
      </main>
    </div>
  );
}
