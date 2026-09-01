"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPurchase } from "@prisma/client";
import { format } from "date-fns";
import { ReceiptIcon } from "lucide-react";
import React from "react";

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

