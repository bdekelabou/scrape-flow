"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";

export async function DownloadInvoice(purchaseId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const purchase = await prisma.userPurchase.findUnique({
    where: {
      id: purchaseId,
      userId,
    },
  });

  if (!purchase) {
    throw new Error("purchase not found");
  }

  // If valid Stripe invoice ID exists and secret key is set
  if (process.env.STRIPE_SECRET_KEY && purchase.stripeId.startsWith("in_")) {
    try {
      const invoice = await stripe.invoices.retrieve(purchase.stripeId);
      if (invoice.hosted_invoice_url || invoice.invoice_pdf) {
        return invoice.hosted_invoice_url || invoice.invoice_pdf;
      }
    } catch (error) {
      console.error("Failed to retrieve stripe invoice:", error);
    }
  }

  // Fallback: return a simple receipt URL or string
  return `/billing?receipt=${purchase.id}`;
}
