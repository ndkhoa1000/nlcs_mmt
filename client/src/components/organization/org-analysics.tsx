import useOrgId from "@/hooks/use-org-id";
import AnalyticsCard from "./common/analytics-card";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationAnalyticsQueryFn } from "@/lib/api";
import { Calendar, FileStack, Clock, PauseCircle, CheckCircle, AlertCircle } from "lucide-react";

const OrganizationAnalytics = () => {
  const orgId = useOrgId();
  const { data, isPending } = useQuery({
    queryKey: ["Org-analysis", orgId],
    queryFn: () => getOrganizationAnalyticsQueryFn(orgId),
    staleTime: 0,
    enabled: !!orgId,
  });
  const OrgAnalysisList = data?.analysis;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Left column - larger cards */}
      <div className="flex flex-col gap-5 md:h-full">
        <AnalyticsCard
          isLoading={isPending}
          title="Total Programs"
          value={OrgAnalysisList?.totalProgram || 0}
          variant="large"
          icon={FileStack}
          iconColor="text-blue-500"
          className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900/50"
        />
        <AnalyticsCard
          isLoading={isPending}
          title="Total Events"
          value={OrgAnalysisList?.totalEvent || 0}
          variant="large"
          icon={Calendar}
          iconColor="text-indigo-500"
          className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-gray-900/50"
        />
      </div>
      
      {/* Right column - grid of 4 smaller cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:h-full">
        <AnalyticsCard
          isLoading={isPending}
          title="Pending Events"
          value={OrgAnalysisList?.totalPendingEvent || 0}
          icon={Clock}
          iconColor="text-amber-500"
          className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-900/50"
        />
        <AnalyticsCard
          isLoading={isPending}
          title="Active Events"
          value={OrgAnalysisList?.totalActiveEvent || 0}
          icon={AlertCircle}
          iconColor="text-green-500"
          className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-gray-900/50"
        />
        <AnalyticsCard
          isLoading={isPending}
          title="Completed Events"
          value={OrgAnalysisList?.totalCompleteEvent || 0}
          icon={CheckCircle}
          iconColor="text-blue-500"
          className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900/50"
        />
        <AnalyticsCard
          isLoading={isPending}
          title="Postponed Events"
          value={OrgAnalysisList?.totalPostponedEvent || 0}
          icon={PauseCircle}
          iconColor="text-orange-500"
          className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-gray-900/50"
        />
      </div>
    </div>
  );
};

export default OrganizationAnalytics;
