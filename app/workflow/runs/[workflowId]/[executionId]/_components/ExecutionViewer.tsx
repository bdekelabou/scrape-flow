"use client";

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  WorkflowIcon,
  XCircleIcon,
} from "lucide-react";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
  initialData,
}: {
  initialData: ExecutionData;
}) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    initialData,
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const execution = query.data;
  const phase = execution?.phases.find((p) => p.id === selectedPhase);

  const duration =
    execution?.startedAt && execution?.completedAt
      ? Math.round(
          (new Date(execution.completedAt).getTime() -
            new Date(execution.startedAt).getTime()) /
            1000
        )
      : execution?.startedAt
      ? Math.round(
          (Date.now() - new Date(execution.startedAt).getTime()) / 1000
        )
      : null;

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <aside className="w-[300px] min-w-[300px] border-r flex flex-col">
        <div className="p-4 flex flex-col gap-3">
          <ExecutionLabel
            icon={WorkflowIcon}
            label="Status"
            value={<ExecutionStatusBadge status={execution?.status} />}
          />
          <ExecutionLabel
            icon={CalendarIcon}
            label="Started at"
            value={
              <span className="lowercase text-xs">
                {execution?.startedAt
                  ? formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })
                  : "-"}
              </span>
            }
          />
          <ExecutionLabel
            icon={ClockIcon}
            label="Duration"
            value={
              <span className="text-xs">
                {duration !== null
                  ? `${Math.floor(duration / 60)}m ${duration % 60}s`
                  : <Loader2Icon size={14} className="animate-spin" />}
              </span>
            }
          />
          <ExecutionLabel
            icon={CoinsIcon}
            label="Credits consumed"
            value={<span className="text-xs">{execution?.creditsConsumed ?? 0}</span>}
          />
        </div>

        <Separator />

        <div className="p-4">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <WorkflowIcon size={14} className="stroke-muted-foreground" />
            Phases
          </h2>
          <div className="flex flex-col gap-1">
            {execution?.phases.map((p) => (
              <button
                key={p.id}
                className={`flex items-center gap-3 text-sm px-3 py-2 rounded-md transition-colors text-left w-full ${
                  selectedPhase === p.id ? "bg-muted" : "hover:bg-muted/50"
                }`}
                onClick={() =>
                  setSelectedPhase(selectedPhase === p.id ? null : p.id)
                }
              >
                <span className="font-bold text-muted-foreground w-4 shrink-0">{p.number}</span>
                <span className="truncate flex-1 text-left">{p.name}</span>
                <PhaseStatusBadge status={p.status} />
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main panel */}
      <main className="flex-1 overflow-auto p-6">
        {phase ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{phase.name}</h2>
                <p className="text-xs text-muted-foreground">Phase {phase.number} · {phase.creditsCost ?? 0} credits</p>
              </div>
              <ExecutionStatusBadge status={phase.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Inputs</h3>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-[200px] whitespace-pre-wrap">
                  {phase.inputs ? JSON.stringify(JSON.parse(phase.inputs), null, 2) : "No inputs"}
                </pre>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Outputs</h3>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-[200px] whitespace-pre-wrap">
                  {phase.outputs ? JSON.stringify(JSON.parse(phase.outputs), null, 2) : "No outputs"}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Logs</h3>
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
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Select a phase to view details
          </div>
        )}
      </main>
    </div>
  );
}

function ExecutionLabel({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize">{value}</div>
    </div>
  );
}

function ExecutionStatusBadge({ status }: { status?: string }) {
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

function PhaseStatusBadge({ status }: { status: string }) {
  switch (status) {
    case ExecutionPhaseStatus.COMPLETED:
      return <CheckCircle2Icon className="h-4 w-4 text-green-500 shrink-0" />;
    case ExecutionPhaseStatus.FAILED:
      return <XCircleIcon className="h-4 w-4 text-red-500 shrink-0" />;
    case ExecutionPhaseStatus.RUNNING:
      return <Loader2Icon className="h-4 w-4 text-blue-500 animate-spin shrink-0" />;
    default:
      return <span className="text-xs text-muted-foreground uppercase shrink-0">{status}</span>;
  }
}


