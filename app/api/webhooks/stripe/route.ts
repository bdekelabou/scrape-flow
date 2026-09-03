import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const packId = session.metadata?.packId as PackId;

      if (!userId || !packId) {
        return new NextResponse("Missing metadata in checkout session", {
          status: 400,
        });
      }

      const pack = getCreditsPack(packId);
      if (!pack) {
        return new NextResponse("Invalid pack ID in metadata", { status: 400 });
      }

      // 1. Credit the user balance
      await prisma.userBalance.upsert({
        where: { userId },
        create: {
          userId,
          credits: 100 + pack.credits,
        },
        update: {
          credits: {
            increment: pack.credits,
          },
        },
      });

      // 2. Record the purchase in user purchase history
      await prisma.userPurchase.create({
        data: {
          userId,
          stripeId: (session.invoice as string) || session.id,
          description: `${pack.name} (${pack.label})`,
          amount: session.amount_total || pack.price,
          currency: session.currency || "usd",
        },
      });

      break;
    }
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
