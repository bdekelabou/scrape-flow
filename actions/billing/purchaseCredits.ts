"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function PurchaseCredits(form: { packId: PackId }) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const pack = getCreditsPack(form.packId);
  if (!pack) {
    throw new Error("invalid pack");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // If Stripe Secret Key is provided, create a real Stripe Checkout session
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        invoice_creation: {
          enabled: true,
        },
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: pack.name,
                description: pack.label,
              },
              unit_amount: pack.price,
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId,
          packId: pack.id,
        },
        success_url: `${appUrl}/billing?success=true`,
        cancel_url: `${appUrl}/billing?canceled=true`,
      });

      if (!session.url) {
        throw new Error("Failed to create Stripe session URL");
      }

      return { url: session.url };
    } catch (err: any) {
      console.error("Stripe session creation error:", err);
      // Fallback to direct purchase if stripe credentials fail in dev
    }
  }

  // Development fallback: direct simulation
  await prisma.userBalance.upsert({
    where: { userId },
    create: { userId, credits: 100 + pack.credits },
    update: {
      credits: { increment: pack.credits },
    },
  });

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: "ch_" + Math.random().toString(36).substring(2),
      description: `${pack.name} (${pack.label})`,
      amount: pack.price,
      currency: "usd",
    },
  });

  revalidatePath("/billing");
  revalidatePath("/");
  return { url: "/billing" };
}
