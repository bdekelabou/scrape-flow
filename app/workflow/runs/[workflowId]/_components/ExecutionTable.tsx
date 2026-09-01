"use client";

import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { Badge } from "@/components/ui/badge";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CoinsIcon } from "lucide-react";
import Link from "next/link";

type InitialData = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

function ExecutionTable({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: InitialData;
}) {
  const query = useQuery({
    queryKey: ["executions", workflowId],
    queryFn: () => GetWorkflowExecutions(workflowId),
    initialData,
  });

  const executions = query.data;

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">ID</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Trigger</th>
            <th className="px-4 py-3 text-left font-semibold">Credits</th>
            <th className="px-4 py-3 text-left font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {executions.map((e) => (
            <tr
              key={e.id}
              className="border-t hover:bg-muted/20 transition-colors"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/workflow/runs/${workflowId}/${e.id}`}
                  className="font-mono text-xs hover:underline text-primary"
                >
                  {e.id.slice(0, 12)}...
                </Link>
              </td>
              <td className="px-4 py-3">
                <ExecutionStatusBadge status={e.status} />
              </td>
              <td className="px-4 py-3 capitalize">{e.trigger.toLowerCase()}</td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-1">
                  <CoinsIcon size={14} className="stroke-amber-500" />
                  {e.creditsConsumed}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {format(new Date(e.createdAt), "dd MMM yyyy HH:mm")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExecutionStatusBadge({ status }: { status: string }) {
  switch (status) {
    case WorkflowExecutionStatus.COMPLETED:
      return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Completed</Badge>;
    case WorkflowExecutionStatus.FAILED:
      return <Badge variant="destructive">Failed</Badge>;
    case WorkflowExecutionStatus.RUNNING:
      return <Badge className="bg-blue-500/20 text-blue-600 animate-pulse">Running</Badge>;
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
}

export default ExecutionTable;
