import QcDashboardClient from "./components/QcDashboardClient";
import { getAwaitingInspection, getActiveWorkOrders } from "./actions";

export const dynamic = "force-dynamic";

export default async function QcDashboardPage() {
  const awaitingInspection = await getAwaitingInspection();
  const activeWorkOrders = await getActiveWorkOrders();

  return (
    <QcDashboardClient 
      initialAwaiting={awaitingInspection} 
      initialWorkOrders={activeWorkOrders} 
    />
  );
}
