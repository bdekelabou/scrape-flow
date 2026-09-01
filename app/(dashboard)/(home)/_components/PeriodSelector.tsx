"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type Period = { year: number; month: number };

export default function PeriodSelector({
  selectedPeriod,
  periods,
}: {
  selectedPeriod: Period;
  periods: Period[];
}) {
  const router = useRouter();

  return (
    <Select
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        router.push(`?month=${month}&year=${year}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        {periods.map((p) => (
          <SelectItem key={`${p.month}-${p.year}`} value={`${p.month}-${p.year}`}>
            {format(new Date(p.year, p.month - 1), "MMMM yyyy")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
