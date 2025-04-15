import { useParams } from "react-router-dom";
import CreateTaskDialog from "../task/create-task-dialog";
import EditProgramDialog from "./edit-program-dialog";
import useOrgId from "@/hooks/use-org-id";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProgramByIdQueryFn } from "@/lib/api";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Permissions } from "@/constant";

const ProgramHeader = () => {
  const param = useParams();
  const programId = param.programId as string;
  const orgId = useOrgId();
  
  const { data, isPending, isError } = useQuery({
    queryKey: ["singleProject", programId],
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

  const programName = "Untitled project";

  const renderContent = () => {
    if (isPending) return <span>Loading...</span>;
    if (isError) return <span>Error occurred</span>;
    return (
      <>
        <Avatar className="p-2 px-4 rounded-lg bg-gray-300 text-xl font-bold flex items-center justify-center">
          <AvatarFallback className="flex items-center justify-center ">
          {(program?.name || programName).split(" ")?.[0]?.toUpperCase().charAt(0)}
          </AvatarFallback>
        </Avatar>
        {(program?.name || programName)}
      </>
    );
  };
  return (
    <div className="flex items-center justify-between space-y-2">
      <div className="flex items-center gap-2">
        <h2 className="flex items-center gap-3 text-xl font-medium truncate tracking-tight">
          {renderContent()}
        </h2>
        <PermissionsGuard requiredPermission={Permissions.EDIT_PROGRAM}>
        {program && <EditProgramDialog program={program} />}
        </PermissionsGuard>
      </div>
      <CreateTaskDialog projectId={programId} />
    </div>
  );
};

export default ProgramHeader;
