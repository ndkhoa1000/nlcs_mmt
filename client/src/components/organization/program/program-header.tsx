import { useParams } from "react-router-dom";
import CreateEventDialog from "../event/create-event-dialog";
import EditProgramDialog from "./edit-program-dialog";
import useOrgId from "@/hooks/use-org-id";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProgramByIdQueryFn } from "@/lib/api";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Permissions } from "@/constant";
import { Calendar, Clock, Info, Users, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ProgramHeader = () => {
  const param = useParams();
  const programId = param.programId as string;
  const orgId = useOrgId();
  
  const { data, isPending, isError } = useQuery({
    queryKey: ["program", programId],
    queryFn: () =>
      getProgramByIdQueryFn(
        orgId,
        programId,
      ),
    staleTime: Infinity,
    enabled: !!programId,
    placeholderData: keepPreviousData,
  });

  const program = data?.program;
  const programName = program?.name || "Untitled project";
  const creator = program?.createBy;
  console.log("creator",creator);
  
  const renderAvatar = () => {
    if (isPending) return <Skeleton className="h-12 w-12 rounded-lg" />;
    if (isError) return <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">!</div>;
    
    return (
      <Avatar className="h-12 w-12 rounded-lg bg-gray-300 text-xl font-bold flex items-center justify-center">
        <AvatarFallback className="flex items-center justify-center">
          {programName.split(" ")?.[0]?.toUpperCase().charAt(0)}
        </AvatarFallback>
      </Avatar>
    );
  };
  
  const renderDetails = () => {
    if (isPending) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium tracking-tight">{programName}</h2>
          <PermissionsGuard requiredPermission={Permissions.EDIT_PROGRAM}>
            {program && <EditProgramDialog program={program} />}
          </PermissionsGuard>
        </div>
        {program?.description && (
          <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">
            {program.description}
          </p>
        )}
      </div>
    );
  };
  
  const renderProgramInfo = () => {
    if (isPending || isError || !program) return null;
    
    return (
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1 py-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {program.startDate ? format(new Date(program.startDate), "MMM d, yyyy") : "No start date"}
                  {program.endDate ? ` - ${format(new Date(program.endDate), "MMM d, yyyy")}` : ""}
                </span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Program timeframe</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {creator && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1 py-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>Created by {creator.name}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>                
                  <p>{creator.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1 py-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Created {format(new Date(program.createAt), "MMM d, yyyy")}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Creation date</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {program.sponsors && program.sponsors.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1 py-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>{program.sponsors.length} sponsor{program.sponsors.length > 1 ? 's' : ''}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{program.sponsors.join(", ")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {program.documents && program.documents.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1 py-1.5">
                  <Info className="h-3.5 w-3.5" />
                  <span>{program.documents.length} document{program.documents.length > 1 ? 's' : ''}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Program has attached documents</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {renderAvatar()}
          <div>
            {renderDetails()}
            {renderProgramInfo()}
          </div>
        </div>
        <CreateEventDialog programId={programId} />
      </div>
    </div>
  );
};

export default ProgramHeader;
