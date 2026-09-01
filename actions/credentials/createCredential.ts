"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function CreateCredential(form: { name: string; value: string }) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const encryptedValue = symmetricEncrypt(form.value);

  const result = await prisma.userCredential.create({
    data: {
      userId,
      name: form.name,
      value: encryptedValue,
    },
  });

  revalidatePath("/credentials");
  return result;
}

