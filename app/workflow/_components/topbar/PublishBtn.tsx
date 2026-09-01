"use client";

import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function PublishBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: async (data: { id: string; flowDefinition: string }) => {
      return await PublishWorkflow(data);
    },
    onSuccess: () => {
      toast.success("Workflow published", { id: "publish-workflow" });
    },
    onError: () => {
      toast.error("Failed to publish workflow", { id: "publish-workflow" });
    },
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2 text-xs"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Publishing workflow...", { id: "publish-workflow" });
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon size={16} className="stroke-blue-400" />
      Publish
    </Button>
  );
}
