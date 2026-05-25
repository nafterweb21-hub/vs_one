import TerminalClient from "./components/TerminalClient";
import { getTerminalSupportData } from "./actions";

export const dynamic = "force-dynamic";

export default async function TerminalPage() {
  const support = await getTerminalSupportData();
  return <TerminalClient support={JSON.parse(JSON.stringify(support))} />;
}
