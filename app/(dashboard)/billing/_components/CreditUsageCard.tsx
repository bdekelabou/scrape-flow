"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoinsIcon } from "lucide-react";
import React from "react";

export default function CreditUsageCard({
  credits,
}: {
  credits: number;
}) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <CoinsIcon size={16} className="stroke-amber-500" />
          Available Credits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold flex items-center gap-2">
          <span className="text-amber-500">
            <CoinsIcon size={28} className="stroke-amber-500" />
          </span>
          <span>{credits ?? 0}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Your credits are automatically deducted when you run workflows.
        </p>
      </CardContent>
    </Card>
  );
}

