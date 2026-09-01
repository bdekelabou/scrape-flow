import { GetStatsCardsValues } from "@/actions/analytics/getStatsCardsValues";
import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CirclePlayIcon,
  CoinsIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WaypointsIcon,
} from "lucide-react";
import React, { Suspense } from "react";
import StatsCard from "./_components/StatsCard";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import CreditUsageChart from "./_components/CreditUsageChart";
import PeriodSelector from "./_components/PeriodSelector";

interface HomePageProps {
  searchParams: {
    month?: string;
    year?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const currentDate = new Date();
  const month = searchParams.month
    ? parseInt(searchParams.month)
    : currentDate.getMonth() + 1;
  const year = searchParams.year
    ? parseInt(searchParams.year)
    : currentDate.getFullYear();

  const period = { month, year };

  return (
    <div className="flex-1 flex flex-col h-full p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Home</h1>
        <PeriodSelector
          selectedPeriod={period}
          periods={getPeriods()}
        />
      </div>

      <div className="h-full py-6 flex flex-col gap-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Suspense fallback={<StatsCard isLoading title="" value={0} icon={CirclePlayIcon} />}>
            <StatsCardsSection />
          </Suspense>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Suspense fallback={<div className="h-[300px] rounded-xl border animate-pulse bg-muted/20" />}>
            <ExecutionStatusChartWrapper period={period} />
          </Suspense>
          <Suspense fallback={<div className="h-[300px] rounded-xl border animate-pulse bg-muted/20" />}>
            <CreditUsageChartWrapper period={period} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function StatsCardsSection() {
  const data = await GetStatsCardsValues();
  return (
    <>
      <StatsCard
        title="Workflow executions"
        value={data.totalExecutions}
        icon={CirclePlayIcon}
      />
      <StatsCard
        title="Successful executions"
        value={data.successfulExecutions}
        icon={TrendingUpIcon}
        className="text-green-500"
      />
      <StatsCard
        title="Failed executions"
        value={data.failedExecutions}
        icon={TrendingDownIcon}
        className="text-red-500"
      />
      <StatsCard
        title="Credits consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
        className="text-amber-500"
      />
    </>
  );
}

async function ExecutionStatusChartWrapper({
  period,
}: {
  period: { month: number; year: number };
}) {
  const data = await GetWorkflowExecutionStats(period);
  return <ExecutionStatusChart data={data} />;
}

async function CreditUsageChartWrapper({
  period,
}: {
  period: { month: number; year: number };
}) {
  const data = await GetCreditUsageInPeriod(period);
  return <CreditUsageChart data={data} />;
}

function getPeriods() {
  const currentDate = new Date();
  const periods = [];
  for (let year = currentDate.getFullYear(); year >= 2024; year--) {
    for (
      let month = year === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 12;
      month >= 1;
      month--
    ) {
      periods.push({ year, month });
    }
  }
  return periods;
}
