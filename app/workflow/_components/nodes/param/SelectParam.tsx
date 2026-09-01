"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskParam } from "@/types/task";
import React from "react";

export default function SelectParam({
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
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          {param.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
