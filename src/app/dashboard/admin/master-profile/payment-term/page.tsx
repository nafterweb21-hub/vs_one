import { getPaymentTerms } from "./actions";
import PaymentTermClient from "./payment-term-client";

export default async function PaymentTermProfilePage() {
  const paymentTerms = await getPaymentTerms();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="flex-1 p-6 overflow-y-auto">
        <PaymentTermClient initialData={paymentTerms} />
      </main>
    </div>
  );
}
