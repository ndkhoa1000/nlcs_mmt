import useOrgId from "@/hooks/use-org-id";
import AnalyticsCard from "../common/analytics-card";
import { useQuery } from "@tanstack/react-query";
import { getProgramAnalyticsQueryFn } from "@/lib/api";
import { Calendar, Clock, CheckCircle, AlertCircle, PauseCircle } from "lucide-react";
import { useParams } from "react-router-dom";

const ProgramAnalytics = () => {
  const orgId = useOrgId();
  const { programId } = useParams<{ programId: string }>();
  
  const { data, isPending } = useQuery({
    queryKey: ["program-analysis", orgId, programId],
    queryFn: () => getProgramAnalyticsQueryFn(orgId, programId || ""),
    staleTime: 0,
    enabled: !!orgId && !!programId,
  });
  
  const programAnalysisList = data?.analysis;
  
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-1">
        <AnalyticsCard
          isLoading={isPending}
          title="Total Events"
          value={programAnalysisList?.totalEvent || 0}
          icon={Calendar}
          iconColor="text-indigo-500"
          className="h-full bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-gray-900/50"
          variant="large"
        />
      </div>
      
      <div className="col-span-2 grid grid-cols-2 gap-3">
        <AnalyticsCard
          isLoading={isPending}
          title="Pending Events"
          value={programAnalysisList?.totalPendingEvent || 0}
          icon={Clock}
          iconColor="text-amber-500"
          className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-900/50"
        />
        <AnalyticsCard
          isLoading={isPending}
          title="Active Events"
          value={programAnalysisList?.totalActiveEvent || 0}
          icon={AlertCircle}
          iconColor="text-green-500"
          className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-gray-900/50"
        />
        <AnalyticsCard
          isLoading={isPending}
          title="Completed Events"
          value={programAnalysisList?.totalCompleteEvent || 0}
          icon={CheckCircle}
          iconColor="text-blue-500"
          className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900/50"
        />
        <AnalyticsCard
          isLoading={isPending}
          title="Postponed Events"
          value={programAnalysisList?.totalPostponedEvent || 0}
          icon={PauseCircle}
          iconColor="text-orange-500"
          className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-gray-900/50"
        />
      </div>
    </div>
  );
};

export default ProgramAnalytics;
