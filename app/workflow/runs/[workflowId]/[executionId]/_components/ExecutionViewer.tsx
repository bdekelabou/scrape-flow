"use client";

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2Icon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
  XCircleIcon,
} from "lucide-react";
import React, { useState } from "react";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
  initialData,
}: {
  initialData: ExecutionData;
}) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(
    initialData?.phases[0]?.id || null
  );

  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    initialData,
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const execution = query.data;
  const phase = execution?.phases.find((p) => p.id === selectedPhase);

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      {/* Sidebar: Phase list */}
      <aside className="w-full md:w-[320px] border-r bg-muted/20 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between pb-2 border-b">
          <span className="font-bold text-sm">Execution Status</span>
          <StatusBadge status={execution?.status} />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>Credits Consumed:</span>
          <span className="font-semibold flex items-center gap-1">
            <CoinsIcon size={14} className="stroke-amber-500" />
            {execution?.creditsConsumed || 0}
          </span>
        </div>

        <div className="mt-4 font-semibold text-xs text-muted-foreground uppercase">
          Execution Phases ({execution?.phases.length || 0})
        </div>

        <div className="flex flex-col gap-1 overflow-auto mt-2">
          {execution?.phases.map((p) => (
            <Button
              key={p.id}
              variant={selectedPhase === p.id ? "secondary" : "ghost"}
              className="justify-between text-xs h-10 px-3"
              onClick={() => setSelectedPhase(p.id)}
            >
              <div className="flex items-center gap-2 truncate">
                <PhaseStatusIcon status={p.status} />
                <span className="truncate">{p.name}</span>
              </div>
              <Badge variant={"outline"} className="text-[10px]">
                Phase {p.number}
              </Badge>
            </Button>
          ))}
        </div>
      </aside>

      {/* Main Details Panel */}
      <main className="flex-1 p-6 overflow-auto flex flex-col gap-6">
        {phase ? (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{phase.name}</span>
                  <StatusBadge status={phase.status} />
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Phase Number:</span>
                  <p className="font-semibold">{phase.number}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Credits Cost:</span>
                  <p className="font-semibold">{phase.creditsCost || 0}</p>
                </div>
              </CardContent>
            </Card>

            {/* Inputs & Outputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Inputs</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-[200px]">
                    {phase.inputs
                      ? JSON.stringify(JSON.parse(phase.inputs), null, 2)
                      : "No inputs"}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Outputs</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-[200px]">
                    {phase.outputs
                      ? JSON.stringify(JSON.parse(phase.outputs), null, 2)
                      : "No outputs"}
                  </pre>
                </CardContent>
              </Card>
            </div>

            {/* Logs Viewer */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-sm">Execution Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-white p-4 rounded-md font-mono text-xs overflow-auto max-h-[300px] flex flex-col gap-1">
                  {phase.logs && phase.logs.length > 0 ? (
                    phase.logs.map((log) => (
                      <div key={log.id} className="flex gap-2">
                        <span className="text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span
                          className={
                            log.logLevel === "error"
                              ? "text-red-400 font-bold"
                              : log.logLevel === "warn"
                              ? "text-yellow-400"
                              : "text-green-400"
                          }
                        >
                          [{log.logLevel.toUpperCase()}]
                        </span>
                        <span>{log.message}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">No logs for this phase</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Select a phase to view details
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  switch (status) {
    case WorkflowExecutionStatus.COMPLETED:
    case ExecutionPhaseStatus.COMPLETED:
      return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Completed</Badge>;
    case WorkflowExecutionStatus.FAILED:
    case ExecutionPhaseStatus.FAILED:
      return <Badge variant="destructive">Failed</Badge>;
    case WorkflowExecutionStatus.RUNNING:
    case ExecutionPhaseStatus.RUNNING:
      return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 animate-pulse">Running</Badge>;
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
}

function PhaseStatusIcon({ status }: { status: string }) {
  switch (status) {
    case ExecutionPhaseStatus.COMPLETED:
      return <CheckCircle2Icon className="h-4 w-4 text-green-500" />;
    case ExecutionPhaseStatus.FAILED:
      return <XCircleIcon className="h-4 w-4 text-red-500" />;
    case ExecutionPhaseStatus.RUNNING:
      return <Loader2Icon className="h-4 w-4 text-blue-500 animate-spin" />;
    default:
      return <ClockIcon className="h-4 w-4 text-gray-400" />;
  }
}
