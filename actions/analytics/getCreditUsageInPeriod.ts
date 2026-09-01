"use server";

import prisma from "@/lib/prisma";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format, startOfMonth } from "date-fns";

export async function GetCreditUsageInPeriod(period: {
  month: number;
  year: number;
}) {
  const { userId } = auth();
  if (!userId) throw new Error("unauthenticated");

  const dateRange = {
    gte: startOfMonth(new Date(period.year, period.month - 1)),
    lte: new Date(),
  };

  const executionPhases = await prisma.executionPhase.findMany({
    where: {
      userId,
      startedAt: { gte: dateRange.gte },
      completedAt: { lte: dateRange.lte },
      status: {
        in: ["COMPLETED", "FAILED"],
      },
    },
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

  for (const phase of executionPhases) {
    const dateKey = format(phase.startedAt!, "yyyy-MM-dd");
    if (stats[dateKey] !== undefined) {
      if (phase.status === "COMPLETED") {
        stats[dateKey].success += phase.creditsCost || 0;
      } else {
        stats[dateKey].failed += phase.creditsCost || 0;
      }
    }
  }

  return Object.entries(stats).map(([date, values]) => ({
    date,
    ...values,
  }));
}
