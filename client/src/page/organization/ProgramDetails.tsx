import { Separator } from "@/components/ui/separator";
import ProgramAnalytics from "@/components/organization/program/program-analytics";
import ProgramHeader from "@/components/organization/program/program-header";
import TaskTable from "@/components/organization/event/event-table";

const ProgramDetails = () => {
  return (
    <div className="w-full space-y-6 py-4 md:pt-3">
      <ProgramHeader />
      <div className="space-y-5">
        <ProgramAnalytics />
        <Separator />
        {/* {Task Table} */}
        <TaskTable />
      </div>
    </div>
  );
};

export default ProgramDetails;
