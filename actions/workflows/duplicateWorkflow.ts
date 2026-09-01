"use server";

import prisma from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DuplicateWorkflow(form: {
  workflowId: string;
  name: string;
  description?: string;
}) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const sourceWorkflow = await prisma.workflow.findUnique({
    where: { id: form.workflowId, userId },
  });

  if (!sourceWorkflow) {
    throw new Error("source workflow not found");
  }

  const result = await prisma.workflow.create({
    data: {
      userId,
      name: form.name,
      description: form.description || sourceWorkflow.description,
      definition: sourceWorkflow.definition,
      status: WorkflowStatus.DRAFT,
    },
  });

  revalidatePath("/workflows");
  return result;
}
