import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { WorkflowExecutionTrigger, WorkflowStatus } from "@/types/workflow";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.API_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = new Date();

  const workflows = await prisma.workflow.findMany({
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: {
        not: null,
      },
      nextRunAt: {
        lte: now,
      },
    },
  });

  const results = [];

  for (const workflow of workflows) {
    try {
      const execution = await prisma.workflowExecution.create({
        data: {
          workflowId: workflow.id,
          userId: workflow.userId,
          trigger: WorkflowExecutionTrigger.CRON,
          status: "PENDING",
          startedAt: new Date(),
          definition: workflow.definition,
        },
      });

      // Launch async workflow execution in background
      ExecuteWorkflow(execution.id);

      results.push({
        workflowId: workflow.id,
        executionId: execution.id,
        name: workflow.name,
      });
    } catch (err: any) {
      console.error(`Failed to trigger cron workflow ${workflow.id}:`, err);
    }
  }

  return NextResponse.json({
    triggered: results.length,
    workflows: results,
  });
}
