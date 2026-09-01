"use client";

import { RunWorkflow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Execution started", { id: "flow-execution" });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to run workflow", {
        id: "flow-execution",
      });
    },
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2 text-xs"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Starting execution...", { id: "flow-execution" });
        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400 fill-orange-400" />
      Execute
    </Button>
  );
}
