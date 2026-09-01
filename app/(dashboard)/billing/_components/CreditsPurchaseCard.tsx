"use client";

import { PurchaseCredits } from "@/actions/billing/purchaseCredits";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditsPacks, PackId } from "@/types/billing";
import { useMutation } from "@tanstack/react-query";
import { CoinsIcon, CreditCardIcon, Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function CreditsPurchaseCard() {
  const [selectedPack, setSelectedPack] = useState<PackId>(PackId.SMALL);

  const mutation = useMutation({
    mutationFn: async (packId: PackId) => {
      return await PurchaseCredits({ packId });
    },
    onSuccess: () => {
      toast.success("Credits added successfully!", { id: "purchase-credits" });
    },
    onError: () => {
      toast.error("Failed to purchase credits", { id: "purchase-credits" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <CoinsIcon size={20} className="stroke-amber-500" />
          Buy Credits
        </CardTitle>
        <CardDescription>
          Select a credits package to power your automation pipelines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedPack}
          onValueChange={(value) => setSelectedPack(value as PackId)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {CreditsPacks.map((pack) => (
            <Label
              key={pack.id}
              htmlFor={pack.id}
              className={`${
                selectedPack === pack.id
                  ? "border-primary bg-primary/5"
                  : "border-border"
              } flex flex-col justify-between p-4 border-2 rounded-lg cursor-pointer hover:border-primary/50 transition-all`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <span className="font-bold text-base">{pack.name}</span>
                <RadioGroupItem value={pack.id} id={pack.id} />
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-extrabold">
                  ${(pack.price / 100).toFixed(2)}
                </span>
              </div>
              <div className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                <CoinsIcon size={12} />
                {pack.label}
              </div>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          disabled={mutation.isPending}
          onClick={() => {
            toast.loading("Processing purchase...", { id: "purchase-credits" });
            mutation.mutate(selectedPack);
          }}
          className="flex items-center gap-2"
        >
          {mutation.isPending ? (
            <Loader2Icon size={16} className="animate-spin" />
          ) : (
            <CreditCardIcon size={16} />
          )}
          Buy Credits
        </Button>
      </CardFooter>
    </Card>
  );
}

