"use client";

import { DownloadInvoice } from "@/actions/billing/downloadInvoice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPurchase } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { DownloadIcon, Loader2Icon, ReceiptIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function InvoiceHistoryTable({
  purchases,
}: {
  purchases: UserPurchase[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ReceiptIcon size={20} className="stroke-primary" />
          Invoices &amp; Purchase History
        </CardTitle>
        <CardDescription>
          View your past credits purchases and download invoices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
            <ReceiptIcon size={32} className="mb-2 stroke-muted-foreground/50" />
            <p>No purchases yet.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Description</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-right font-semibold">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="border-t">
                    <td className="px-4 py-3 text-muted-foreground">
                      {format(new Date(purchase.date), "dd MMM yyyy")}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {purchase.description}
                    </td>
                    <td className="px-4 py-3 font-bold">
                      ${(purchase.amount / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {purchase.stripeId}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DownloadInvoiceBtn purchaseId={purchase.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DownloadInvoiceBtn({ purchaseId }: { purchaseId: string }) {
  const mutation = useMutation({
    mutationFn: async () => {
      return await DownloadInvoice(purchaseId);
    },
    onSuccess: (url) => {
      if (url && url.startsWith("http")) {
        window.open(url, "_blank");
      } else {
        toast.info("Invoice receipt generated", { id: "download-invoice" });
      }
    },
    onError: () => {
      toast.error("Failed to retrieve invoice", { id: "download-invoice" });
    },
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Fetching invoice...", { id: "download-invoice" });
        mutation.mutate();
      }}
      className="gap-1 h-8 px-2 text-xs"
    >
      {mutation.isPending ? (
        <Loader2Icon size={14} className="animate-spin" />
      ) : (
        <DownloadIcon size={14} />
      )}
      PDF
    </Button>
  );
}
