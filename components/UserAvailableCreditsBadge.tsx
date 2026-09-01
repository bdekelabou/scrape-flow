"use client";

import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function UserAvailableCreditsBadge() {
  const query = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => GetAvailableCredits(),
    refetchInterval: 30 * 1000,
  });

  return (
    <Link
      href="/billing"
      className={cn(
        "w-full space-x-2 items-center",
        buttonVariants({ variant: "outline" })
      )}
    >
      <CoinsIcon size={20} className="text-primary stroke-amber-500" />
      <span className="font-semibold capitalize">
        {query.isLoading ? (
          <Loader2Icon className="w-4 h-4 animate-spin" />
        ) : (
          query.data ?? 0
        )}
      </span>
      <span className="text-muted-foreground text-xs">credits</span>
    </Link>
  );
}