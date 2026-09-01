"use client";

import { UnpublishWorkflow } from "@/actions/workflows/unpublishWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function UnpublishBtn({ workflowId }: { workflowId: string }) {
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success("Workflow unpublished", { id: "unpublish-workflow" });
    },
    onError: () => {
      toast.error("Failed to unpublish workflow", { id: "unpublish-workflow" });
    },
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2 text-xs"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Unpublishing workflow...", { id: "unpublish-workflow" });
        mutation.mutate(workflowId);
      }}
    >
      <DownloadIcon size={16} className="stroke-amber-400" />
      Unpublish
    </Button>
  );
}
