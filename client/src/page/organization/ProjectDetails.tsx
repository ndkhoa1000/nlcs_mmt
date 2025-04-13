import { Separator } from "@/components/ui/separator";
import ProjectAnalytics from "@/components/organization/project/project-analytics";
import ProjectHeader from "@/components/organization/project/project-header";
import TaskTable from "@/components/organization/task/task-table";

const ProjectDetails = () => {
  return (
    <div className="w-full space-y-6 py-4 md:pt-3">
      <ProjectHeader />
      <div className="space-y-5">
        <ProjectAnalytics />
        <Separator />
        {/* {Task Table} */}
        <TaskTable />
      </div>
    </div>
  );
};

export default ProjectDetails;
