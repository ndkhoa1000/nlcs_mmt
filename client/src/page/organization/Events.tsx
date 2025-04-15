import CreateEventDialog from "@/components/organization/event/create-event-dialog";
import TaskTable from "@/components/organization/event/event-table";

export default function Events() {
  return (
    <div className="w-full h-full flex-col space-y-8 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Events</h2>
          <p className="text-muted-foreground">
            Here&apos;s the list of events for this organization!
          </p>
        </div>
        <CreateEventDialog />
      </div>
      {/* {Task Table} */}
      <div>
        <TaskTable />
      </div>
    </div>
  );
}
