import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useOrgId from "@/hooks/use-org-id";
import { getProgramsInOrganizationQueryFn } from "@/lib/api";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";

const RecentPrograms = () => {
  const orgId = useOrgId();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["recentPrograms", orgId],
    queryFn: () => getProgramsInOrganizationQueryFn({ 
      orgId, 
      pageSize: 10, 
      pageNumber: 1 
    }),
    enabled: !!orgId
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div className="text-red-500">Failed to load recent programs</div>;
  }

  const programs = data?.programs || [];

  if (programs.length === 0) {
    return <div className="text-muted-foreground p-4 text-center">No programs found</div>;
  }

  const emojis = ["🚀", "🌱", "🔍", "📊", "🏆", "🎯", "📚", "⚡", "🎨", "🛠️"]; 

  return (
    <div className="flex flex-col pt-2">
      <ul role="list" className="space-y-2">
        {programs.map((program, index) => {
          const emoji = emojis[index % emojis.length];
          const createdBy = program.createBy;
          const name = createdBy?.name || "Unknown";
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          const formattedDate = program.createAt ? format(new Date(program.createAt), "MMMM d, yyyy") : "Unknown date";
          
          return (
            <li
              key={program._id}
              role="listitem"
              className="shadow-none cursor-pointer border-0 py-2 hover:bg-gray-50 transition-colors ease-in-out rounded-md"
            >
              <Link
                to={`/organization/${orgId}/program/${program._id}`}
                className="grid gap-8 p-2"
              >
                <div className="flex items-start gap-2">
                  <div className="text-xl !leading-[1.4rem]">{emoji}</div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {program.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <span className="text-sm text-gray-500">Created by</span>
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src={createdBy?.profilePicture || ""} alt={name} />
                      <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="flex flex-col pt-2">
    <ul role="list" className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <li key={i} className="shadow-none cursor-pointer border-0 py-2 p-2">
          <div className="flex items-start gap-2">
            <Skeleton className="h-6 w-6 rounded" />
            <div className="grid gap-1 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentPrograms;
