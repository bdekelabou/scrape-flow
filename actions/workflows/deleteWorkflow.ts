"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DeleteWorkflow(id: string) {
    const { userId } = auth();

    if (!userId) {
        throw new Error("unauthenticated");
    }

    const result = await prisma.workflow.deleteMany({
        where: {
            id,
            userId,
        },
    });

    if (result.count === 0) {
        throw new Error("workflow not found");
    }
    
    revalidatePath("/workflows");
}