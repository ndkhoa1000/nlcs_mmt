import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useOrgId from "@/hooks/use-org-id";
import { getAllMemberInOrganizationQueryFn } from "@/lib/api";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";

const RecentMembers = () => {
  const orgId = useOrgId();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["members", orgId],
    queryFn: () => getAllMemberInOrganizationQueryFn(orgId),
    enabled: !!orgId
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">Failed to load members</div>;
  }

  const members = data?.members || [];

  if (members.length === 0) {
    return <div className="text-muted-foreground p-4 text-center">No members found</div>;
  }

  // Only show the most recent members (up to 7)
  const recentMembers = members
    .sort((a, b) => new Date(b.joinAt).getTime() - new Date(a.joinAt).getTime())
    .slice(0, 7);

  return (
    <div className="flex flex-col pt-2">
      <ul role="list" className="space-y-3">
        {recentMembers.map((member) => {
          const userData = member.userId;
          const name = userData?.name || "Unknown";
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          const joinedDate = member.joinAt ? format(new Date(member.joinAt), "MMMM d, yyyy") : "Unknown";
          
          return (
            <li
              key={member._id}
              role="listitem"
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-9 w-9 sm:flex">
                  <AvatarImage src={userData?.profilePicture || ""} alt={name} />
                  <AvatarFallback className={avatarColor}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Member Details */}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{member.role?.name || "Member"}</p>
              </div>

              {/* Joined Date */}
              <div className="ml-auto text-sm text-gray-500 text-right">
                <p>Joined</p>
                <p>{joinedDate}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="flex flex-col pt-2">
    <ul role="list" className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <li
          key={i}
          className="flex items-center gap-4 p-3 rounded-lg border border-gray-200"
        >
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="ml-auto flex flex-col gap-1 items-end">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentMembers;
