"use server";

import prisma from "@/lib/prisma";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function GetStatsCardsValues() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const executions = await prisma.workflowExecution.findMany({
    where: { userId },
  });

  const totalExecutions = executions.length;
  const creditsConsumed = executions.reduce((acc, curr) => acc + curr.creditsConsumed, 0);

  const successfulExecutions = executions.filter(
    (e) => e.status === WorkflowExecutionStatus.COMPLETED
  ).length;

  const failedExecutions = executions.filter(
    (e) => e.status === WorkflowExecutionStatus.FAILED
  ).length;

  return {
    totalExecutions,
    creditsConsumed,
    successfulExecutions,
    failedExecutions,
  };
}
