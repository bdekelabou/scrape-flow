"use client";

import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskParam } from "@/types/task";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function CredentialParam({
  param,
  value,
  updateNodeParamValue,
  disabled,
}: {
  param: TaskParam;
  value?: string;
  updateNodeParamValue: (val: string) => void;
  disabled?: boolean;
}) {
  const query = useQuery({
    queryKey: ["credentials"],
    queryFn: () => GetCredentialsForUser(),
  });

  return (
    <div className="flex flex-col gap-1 w-full p-1">
      <div className="flex justify-between items-center">
        <Label className="text-xs flex">{param.name}</Label>
      </div>
      <Select
        disabled={disabled}
        value={value || ""}
        onValueChange={updateNodeParamValue}
      >
        <SelectTrigger className="w-full text-xs">
          <SelectValue placeholder="Select credential" />
        </SelectTrigger>
        <SelectContent>
          {query.data?.map((credential) => (
            <SelectItem key={credential.id} value={credential.name}>
              {credential.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
