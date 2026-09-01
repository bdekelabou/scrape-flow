import { AppNode } from "@/types/appNode";
import { LogFunction } from "@/types/log";

export interface WorkflowExecutionPlanPhase {
  phase: number;
  nodes: AppNode[];
}

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export interface ExecutionEnvironment {
  browser?: any;
  page?: any;
  phases: {
    [key: string]: {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    };
  };
}

export interface ExecutionContext {
  environment: ExecutionEnvironment;
  log: LogFunction;
  node: AppNode;
}
