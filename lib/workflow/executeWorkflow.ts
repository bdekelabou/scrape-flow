import prisma from "@/lib/prisma";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { FlowExecutionPlan } from "./executionPlan";
import { ExecutorRegistry } from "./executor/registry";
import { ExecutionEnvironment } from "@/types/execution";
import { TaskRegistry } from "./task/registry";
import { LogLevel } from "@/types/log";
import { TaskType } from "@/types/task";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  const edges = JSON.parse(execution.definition).edges || [];
  const nodes = JSON.parse(execution.definition).nodes || [];

  const environment: ExecutionEnvironment = {
    phases: {},
  };

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  let creditsConsumed = 0;
  let executionFailed = false;

  try {
    for (const phase of execution.phases) {
      const phaseNode = nodes.find((n: any) => n.id === phase.node);
      if (!phaseNode) continue;

      // Collect inputs for phase from incoming edges/environment
      const task = TaskRegistry[phaseNode.data.type as TaskType];
      const phaseInputs: Record<string, string> = {};

      for (const input of task.inputs) {
        if (input.type === "BROWSER_INSTANCE") continue;
        const inputValue = phaseNode.data.inputs?.[input.name];
        if (inputValue) {
          phaseInputs[input.name] = inputValue;
        } else {
          // Resolve input from connected output in environment
          const incomingEdge = edges.find(
            (edge: any) =>
              edge.target === phaseNode.id && edge.targetHandle === input.name
          );
          if (incomingEdge) {
            const sourceOutputValue =
              environment.phases[incomingEdge.source]?.outputs?.[
                incomingEdge.sourceHandle
              ];
            if (sourceOutputValue) {
              phaseInputs[input.name] = sourceOutputValue;
            }
          }
        }
      }

      environment.phases[phaseNode.id] = {
        inputs: phaseInputs,
        outputs: {},
      };

      await prisma.executionPhase.update({
        where: { id: phase.id },
        data: {
          status: ExecutionPhaseStatus.RUNNING,
          startedAt: new Date(),
          inputs: JSON.stringify(phaseInputs),
        },
      });

      const executor = ExecutorRegistry[phaseNode.data.type as TaskType];
      const logEntries: { message: string; level: LogLevel }[] = [];

      const logFn = (message: string, level: LogLevel = "info") => {
        logEntries.push({ message, level });
      };

      let success = false;
      try {
        success = await executor(environment, logFn, phaseNode);
      } catch (err: any) {
        logFn(`Unhandled phase error: ${err.message}`, "error");
        success = false;
      }

      const phaseOutputs = environment.phases[phaseNode.id]?.outputs || {};
      const phaseCredits = task.credits || 0;
      creditsConsumed += phaseCredits;

      // Persist logs in DB
      if (logEntries.length > 0) {
        await prisma.executionLog.createMany({
          data: logEntries.map((log) => ({
            executionPhaseId: phase.id,
            message: log.message,
            logLevel: log.level,
          })),
        });
      }

      await prisma.executionPhase.update({
        where: { id: phase.id },
        data: {
          status: success
            ? ExecutionPhaseStatus.COMPLETED
            : ExecutionPhaseStatus.FAILED,
          completedAt: new Date(),
          outputs: JSON.stringify(phaseOutputs),
          creditsCost: phaseCredits,
        },
      });

      if (!success) {
        executionFailed = true;
        break;
      }
    }
  } finally {
    if (environment.browser) {
      try {
        await environment.browser.close();
      } catch (err) {
        console.error("Error closing browser:", err);
      }
    }
  }

  // Deduct credits from user balance
  if (creditsConsumed > 0) {
    await prisma.userBalance.upsert({
      where: { userId: execution.userId },
      create: { userId: execution.userId, credits: 100 - creditsConsumed },
      update: { credits: { decrement: creditsConsumed } },
    });
  }

  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow.update({
    where: { id: execution.workflowId },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: finalStatus,
    },
  });

  return { success: !executionFailed, creditsConsumed };
}

