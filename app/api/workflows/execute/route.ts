import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { WorkflowExecutionTrigger, WorkflowStatus } from "@/types/workflow";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleExecution(req);
}

export async function POST(req: Request) {
  return handleExecution(req);
}

async function handleExecution(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.API_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let workflowId = searchParams.get("workflowId");

    if (!workflowId && req.method === "POST") {
      try {
        const body = await req.json();
        workflowId = body.workflowId;
      } catch {
        // Ignored if body is empty
      }
    }

    if (!workflowId) {
      return new NextResponse("Bad Request: missing workflowId", {
        status: 400,
      });
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      return new NextResponse("Workflow not found", { status: 404 });
    }

    if (workflow.status !== WorkflowStatus.PUBLISHED) {
      return new NextResponse("Workflow is not published", { status: 400 });
    }

    // Check user balance
    const userBalance = await prisma.userBalance.findUnique({
      where: { userId: workflow.userId },
    });

    if (!userBalance || userBalance.credits < workflow.creditsCost) {
      return new NextResponse("Insufficient credits to execute workflow", {
        status: 400,
      });
    }

    // Create workflow execution
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: workflow.id,
        userId: workflow.userId,
        trigger: WorkflowExecutionTrigger.CRON,
        status: "PENDING",
        startedAt: new Date(),
        definition: workflow.definition,
        creditsConsumed: workflow.creditsCost,
      },
    });

    // Launch execution in background
    ExecuteWorkflow(execution.id);

    return NextResponse.json(
      {
        success: true,
        executionId: execution.id,
        workflowId: workflow.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Workflow API execution error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
