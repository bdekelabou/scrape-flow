import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { GetUserPurchaseHistory } from "@/actions/billing/getUserPurchaseHistory";
import CreditUsageCard from "./_components/CreditUsageCard";
import CreditsPurchaseCard from "./_components/CreditsPurchaseCard";
import InvoiceHistoryTable from "./_components/InvoiceHistoryTable";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
      <div>
        <h1 className="text-3xl font-bold">Billing &amp; Credits</h1>
        <p className="text-muted-foreground text-sm">
          Manage your available balance and purchase automation credits.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex h-40 w-full items-center justify-center">
            <Loader2Icon className="h-8 w-8 animate-spin stroke-primary" />
          </div>
        }
      >
        <BillingContent />
      </Suspense>
    </div>
  );
}
	async function BillingContent() {
  const credits = await GetAvailableCredits();
  const purchases = await GetUserPurchaseHistory();

  return (
    <div className="flex flex-col gap-6">
      <CreditUsageCard credits={credits} />
      <CreditsPurchaseCard />
      <InvoiceHistoryTable purchases={purchases} />
    </div>
  );
}
