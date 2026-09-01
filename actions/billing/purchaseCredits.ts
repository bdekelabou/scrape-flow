"use server";

import prisma from "@/lib/prisma";
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
      description: pack.name + " (" + pack.label + ")",
      amount: pack.price,
      currency: "usd",
    },
  });

  revalidatePath("/billing");
  revalidatePath("/");
  return { success: true };
}

