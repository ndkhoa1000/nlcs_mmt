import { FC, useState } from "react";
import { getColumns } from "./table/columns";
import { DataTable } from "./table/table";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "./table/table-faceted-filter";
import { priorities, statuses } from "./table/data";
import useEventTableFilter from "@/hooks/use-task-table-filter";
import { useQuery } from "@tanstack/react-query";
import useOrgId from "@/hooks/use-org-id";
import { getAllEventsInOrgQueryFn } from "@/lib/api";
import { EventType } from "@/types/api.type";

type Filters = ReturnType<typeof useEventTableFilter>[0];
type SetFilters = ReturnType<typeof useEventTableFilter>[1];

interface DataTableFilterToolbarProps {
  isLoading?: boolean;
  programId?: string;
  filters: Filters;
  setFilters: SetFilters;
}
const TaskTable = () => {
  const param = useParams();
  const programId = param.programId as string;

  const orgId = useOrgId();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useEventTableFilter();
  const columns = getColumns(programId);

  // Fix: Standardize query key
  const { data, isLoading } = useQuery({
    queryKey: [
      "events",
      orgId,
      pageSize,
      pageNumber,
      filters,
      programId,
    ],
    queryFn: () =>
      getAllEventsInOrgQueryFn({
        orgId,
        keyword: filters.keyword ?? undefined,
        priority: filters.priority ? filters.priority.split(",") : undefined,
        status: filters.status ? filters.status.split(",") : undefined,
        programId: programId || (filters.programId ?? undefined),
        assignedTo: filters.assignedId ? filters.assignedId.split(",") : undefined,
        pageNumber,
        pageSize,
      }),
    staleTime: 0,
  });

  const events: EventType[] = data?.events || [];
  const totalCount = data?.pagination.totalCount || 0;

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  // Handle page size changes
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  return (
    <div className="w-full relative">
      <DataTable
        isLoading={isLoading}
        data={events}
        columns={columns}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pagination={{
          totalCount,
          pageNumber,
          pageSize,
        }}
        // filtersToolbar={
        //   <DataTableFilterToolbar
        //     isLoading={false}
        //     projectId={projectId}
        //     filters={filters}
        //     setFilters={setFilters}
        //   />
        // }
      />
    </div>
  );
};
//NOTE: skip implement filter
const DataTableFilterToolbar: FC<DataTableFilterToolbarProps> = ({
  isLoading,
  programId: projectId,
  filters,
  setFilters,
}) => {
  //const workspaceId = useWorkspaceId();

  //Workspace Projects
  //const projectOptions = [];

  // Workspace Memebers
  //const assignees = []

  const handleFilterChange = (key: keyof Filters, values: string[]) => {
    setFilters({
      ...filters,
      [key]: values.length > 0 ? values.join(",") : null,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row w-full items-start space-y-2 mb-2 lg:mb-0 lg:space-x-2  lg:space-y-0">
      <Input
        placeholder="Filter tasks..."
        value={filters.keyword || ""}
        onChange={(e) =>
          setFilters({
            keyword: e.target.value,
          })
        }
        className="h-8 w-full lg:w-[250px]"
      />
      {/* Status filter */}
      <DataTableFacetedFilter
        title="Status"
        multiSelect={true}
        options={statuses}
        disabled={isLoading}
        selectedValues={filters.status?.split(",") || []}
        onFilterChange={(values) => handleFilterChange("status", values)}
      />

      {/* Priority filter */}
      <DataTableFacetedFilter
        title="Priority"
        multiSelect={true}
        options={priorities}
        disabled={isLoading}
        selectedValues={filters.priority?.split(",") || []}
        onFilterChange={(values) => handleFilterChange("priority", values)}
      />

      {/* Assigned To filter */}
      <DataTableFacetedFilter
        title="Assigned To"
        multiSelect={true}
        options={[]}
        disabled={isLoading}
        selectedValues={filters.assigneeId?.split(",") || []}
        onFilterChange={(values) => handleFilterChange("assigneeId", values)}
      />

      {!projectId && (
        <DataTableFacetedFilter
          title="Projects"
          multiSelect={false}
          options={[]}
          disabled={isLoading}
          selectedValues={filters.projectId?.split(",") || []}
          onFilterChange={(values) => handleFilterChange("projectId", values)}
        />
      )}

      {Object.values(filters).some(
        (value) => value !== null && value !== ""
      ) && (
        <Button
          disabled={isLoading}
          variant="ghost"
          className="h-8 px-2 lg:px-3"
          onClick={() =>
            setFilters({
              keyword: null,
              status: null,
              priority: null,
              projectId: null,
              assigneeId: null,
            })
          }
        >
          Reset
          <X />
        </Button>
      )}
    </div>
  );
};

export default TaskTable;
