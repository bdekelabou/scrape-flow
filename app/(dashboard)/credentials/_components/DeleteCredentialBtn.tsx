"use client";

import { DeleteCredential } from "@/actions/credentials/deleteCredential";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

export default function DeleteCredentialBtn({ name }: { name: string }) {
  const mutation = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success("Credential deleted", { id: "delete-credential" });
    },
    onError: () => {
      toast.error("Failed to delete credential", { id: "delete-credential" });
    },
  });

  return (
    <Button
      variant={"destructive"}
      size={"icon"}
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Deleting credential...", { id: "delete-credential" });
        mutation.mutate(name);
      }}
    >
      <Trash2Icon size={16} />
    </Button>
  );
}
