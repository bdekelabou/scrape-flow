"use server";

import prisma from "@/lib/prisma";
import {
  FlowExecutionPlan,
  FlowExecutionPlanValidationError,
} from "@/lib/workflow/executionPlan";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const { workflowId, flowDefinition } = form;
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId, userId },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const definition = flowDefinition || workflow.definition;
  const flow = JSON.parse(definition);

  const result = FlowExecutionPlan(flow.nodes || [], flow.edges || []);
  if (result.error) {
    if (result.error.type === FlowExecutionPlanValidationError.NO_ENTRY_POINT) {
      throw new Error("No entry point found (e.g., Launch browser)");
    }
    if (result.error.type === FlowExecutionPlanValidationError.INVALID_INPUTS) {
      const missing = result.error.invalidInputs
        ?.map((i) => i.inputs.join(", "))
        .join("; ");
      throw new Error(`Please fill required inputs: ${missing}`);
    }
    throw new Error("Flow execution plan invalid");
  }

  const executionPlan = result.executionPlan!;

  let executionPhasesData: any[] = [];
  let phaseNumber = 1;

  for (const phase of executionPlan) {
    for (const node of phase.nodes) {
      executionPhasesData.push({
        userId,
        status: ExecutionPhaseStatus.CREATED,
        number: phaseNumber++,
        node: node.id,
        name: TaskRegistry[node.data.type].label,
        creditsCost: TaskRegistry[node.data.type].credits,
      });
    }
  }

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition,
      phases: {
        create: executionPhasesData,
      },
    },
  });

  // Run execution async
  ExecuteWorkflow(execution.id);

  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
