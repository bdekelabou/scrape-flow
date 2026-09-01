import { AppNode } from "@/types/appNode";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/execution";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "@/lib/workflow/task/registry";

export enum FlowExecutionPlanValidationError {
  "NO_ENTRY_POINT" = "NO_ENTRY_POINT",
  "INVALID_INPUTS" = "INVALID_INPUTS",
}

export type FlowExecutionPlanValidationErrorType = {
  type: FlowExecutionPlanValidationError;
  invalidInputs?: {
    nodeId: string;
    inputs: string[];
  }[];
};

export type FlowExecutionPlanResult = {
  executionPlan?: WorkflowExecutionPlan;
  error?: FlowExecutionPlanValidationErrorType;
};

export function FlowExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): FlowExecutionPlanResult {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    return {
      error: {
        type: FlowExecutionPlanValidationError.NO_ENTRY_POINT,
      },
    };
  }

  const inputsWithErrors: { nodeId: string; inputs: string[] }[] = [];
  const planned = new Set<string>();

  const invalidInputs = getInvalidInputs(entryPoint, edges, planned, nodes);
  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const node of nodes) {
      if (planned.has(node.id)) continue;

      const invalidInputs = getInvalidInputs(node, edges, planned, nodes);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(node, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          inputsWithErrors.push({
            nodeId: node.id,
            inputs: invalidInputs,
          });
        } else {
          continue;
        }
      }

      nextPhase.nodes.push(node);
    }

    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    if (nextPhase.nodes.length > 0) {
      executionPlan.push(nextPhase);
    }
  }

  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowExecutionPlanValidationError.INVALID_INPUTS,
        invalidInputs: inputsWithErrors,
      },
    };
  }

  return { executionPlan };
}

function getInvalidInputs(
  node: AppNode,
  edges: Edge[],
  planned: Set<string>,
  nodes: AppNode[]
): string[] {
  const invalidInputs: string[] = [];
  const task = TaskRegistry[node.data.type];

  for (const input of task.inputs) {
    const inputValue = node.data.inputs?.[input.name];
    const inputValueProvided = inputValue && inputValue.trim() !== "";
    if (inputValueProvided) continue;

    // Check if connected via edge
    const incomingEdges = edges.filter(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    const inputLinkedToOutput = incomingEdges.length > 0;

    if (input.required && !inputValueProvided && !inputLinkedToOutput) {
      invalidInputs.push(input.name);
    } else if (inputLinkedToOutput) {
      const incomingEdge = incomingEdges[0];
      if (!planned.has(incomingEdge.source)) {
        invalidInputs.push(input.name);
      }
    }
  }

  return invalidInputs;
}
