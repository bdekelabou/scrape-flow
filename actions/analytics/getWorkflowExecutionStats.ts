"use server";

import prisma from "@/lib/prisma";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format, startOfMonth, endOfMonth } from "date-fns";

export async function GetWorkflowExecutionStats(period: {
  month: number;
  year: number;
}) {
  const { userId } = auth();
  if (!userId) throw new Error("unauthenticated");

  const now = new Date();
  const monthStart = startOfMonth(new Date(period.year, period.month - 1));
  const monthEnd =
    period.year === now.getFullYear() && period.month === now.getMonth() + 1
      ? now
      : endOfMonth(monthStart);

  const dateRange = {
    gte: monthStart,
    lte: monthEnd,
  };

  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      status: {
        in: [
          WorkflowExecutionStatus.COMPLETED,
          WorkflowExecutionStatus.FAILED,
        ],
      },
      startedAt: dateRange,
    },
    include: { phases: true },
  });

  const datesInRange = eachDayOfInterval({
    start: dateRange.gte,
    end: dateRange.lte,
  });

  const stats: Record<string, { success: number; failed: number }> = {};

  for (const date of datesInRange) {
    const dateKey = format(date, "yyyy-MM-dd");
    stats[dateKey] = { success: 0, failed: 0 };
  }

  for (const execution of executions) {
    const dateKey = format(execution.startedAt!, "yyyy-MM-dd");
    if (stats[dateKey] !== undefined) {
      if (execution.status === WorkflowExecutionStatus.COMPLETED) {
        stats[dateKey].success++;
      } else {
        stats[dateKey].failed++;
      }
    }
  }

  return Object.entries(stats).map(([date, values]) => ({
    date,
    ...values,
  }));
}
