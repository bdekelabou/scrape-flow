import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExecutionTable from "./_components/ExecutionTable";

export default function ExecutionsPage({
  params,
}: {
  params: { workflowId: string };
}) {
  return (
    <div className="h-full w-full overflow-auto">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">All runs</h1>
            <p className="text-sm text-muted-foreground">
              Execution history for this workflow
            </p>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <Loader2Icon className="h-8 w-8 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionTableWrapper workflowId={params.workflowId} />
        </Suspense>
      </div>
    </div>
  );
}

async function ExecutionTableWrapper({
  workflowId,
}: {
  workflowId: string;
}) {
  const executions = await GetWorkflowExecutions(workflowId);

  if (executions.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <InboxIcon size={40} />
        <p className="font-semibold">No executions found for this workflow.</p>
        <p className="text-xs">
          You can execute your workflow from the editor
        </p>
      </div>
    );
  }

  return <ExecutionTable workflowId={workflowId} initialData={executions} />;
}
