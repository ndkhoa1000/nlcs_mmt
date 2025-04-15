import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EventPriorityEnum } from "@/constant";
import { getAvatarColor, getAvatarFallbackText, StatusBadgeVariant, transformStatusEnum } from "@/lib/helper";
import useOrgId from "@/hooks/use-org-id";
import { getAllEventsInOrgQueryFn } from "@/lib/api";
import { format } from "date-fns";
import { EventType } from "@/types/api.type";
import { Link } from "react-router-dom";

const RecentTasks = () => {
  const orgId = useOrgId();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["recentEvents", orgId],
    queryFn: () => getAllEventsInOrgQueryFn({ 
      orgId, 
      pageSize: 5, 
      pageNumber: 1 
    }),
    enabled: !!orgId
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">Failed to load recent events</div>;
  }

  const events = data?.events || [];

  if (events.length === 0) {
    return <div className="text-muted-foreground p-4 text-center">No recent events</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      <ul role="list" className="divide-y divide-gray-200">
        {events.map((event: EventType) => {
          // Default to the first assigned member, if any
          const assignee = event.assignedTo?.[0];
          const name = assignee?.name || "N/A";
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          
          return (
            <li
              key={event._id}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-md"
            >
              <Link 
                to={`/organization/${orgId}/event/${event._id}`}
                className="flex flex-1 items-center justify-between"
              >
                {/* Event Info */}
                <div className="flex flex-col space-y-1 flex-grow">
                  <p className="text-md font-semibold text-gray-800 truncate">
                    {event.title}
                  </p>
                  <span className="text-sm text-gray-500">
                    {event.startTime ? `Starts: ${format(new Date(event.startTime), "MMM d, yyyy")}` : "No start date"}
                  </span>
                </div>

                {/* Event Status */}
                <div className="text-sm font-medium">
                  <Badge
                    variant={StatusBadgeVariant(event.status)}
                    className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0"
                  >
                    <span>{transformStatusEnum(event.status)}</span>
                  </Badge>
                </div>

                {/* Event Priority */}
                <div className="text-sm ml-2">
                  <Badge
                    variant={EventPriorityEnum[event.priority] || "default"}
                    className="flex w-auto p-1 px-2 gap-1 font-medium shadow-sm uppercase border-0"
                  >
                    <span>{transformStatusEnum(event.priority)}</span>
                  </Badge>
                </div>

                {/* Assignee */}
                {assignee && (
                  <div className="flex items-center space-x-2 ml-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={assignee.profilePicture || ""} alt={name} />
                      <AvatarFallback className={avatarColor}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="flex flex-col space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="p-4 flex items-center justify-between">
        <div className="flex flex-col space-y-2 flex-grow">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-7 w-24 mx-2" />
        <Skeleton className="h-7 w-20 mx-2" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    ))}
  </div>
);

export default RecentTasks;
