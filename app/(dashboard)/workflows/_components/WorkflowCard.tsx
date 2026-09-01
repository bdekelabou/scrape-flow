"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import {
  ClockIcon,
  CoinsIcon,
  CopyIcon,
  FileTextIcon,
  MoreVerticalIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";
import RunBtn from "./RunBtn";
import { useMutation } from "@tanstack/react-query";
import { DuplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between min-h-[100px]">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-5 w-5 text-white" />
            ) : (
              <PlayIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
            </h3>

            {/* Cron & Credits metadata if published */}
            {!isDraft && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <ClockIcon size={12} />
                  {workflow.cron === "*/2 * * * *"
                    ? "Every 2 minutes"
                    : workflow.cron === "0 * * * *"
                    ? "Every hour"
                    : "Every minute"}
                </span>
                <span>→</span>
                <span className="flex items-center gap-1">
                  <CoinsIcon size={12} className="stroke-amber-500" />
                  {workflow.creditsCost || 0}
                </span>
              </div>
            )}

            {/* Last run status details */}
            {workflow.lastRunAt && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>Last run:</span>
                <span
                  className={cn(
                    "font-semibold capitalize",
                    workflow.lastRunStatus === "COMPLETED"
                      ? "text-green-500"
                      : "text-red-500"
                  )}
                >
                  ● {workflow.lastRunStatus?.toLowerCase()}
                </span>
                <span>
                  {formatDistanceToNow(new Date(workflow.lastRunAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isDraft && <RunBtn workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function WorkflowActions({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const duplicateMutation = useMutation({
    mutationFn: async (data: { workflowId: string; name: string; description?: string }) => {
      return await DuplicateWorkflow(data);
    },
    onSuccess: () => {
      toast.success("Workflow duplicated", { id: "duplicate-workflow" });
    },
    onError: () => {
      toast.error("Failed to duplicate workflow", { id: "duplicate-workflow" });
    },
  });

  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"sm"}>
            <div className="flex items-center justify-center w-full h-full">
              <MoreVerticalIcon size={18} />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
              duplicateMutation.mutate({
                workflowId,
                name: `${workflowName} (Copy)`,
              });
            }}
          >
            <CopyIcon size={16} />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2 cursor-pointer"
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev);
            }}
          >
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default WorkflowCard;