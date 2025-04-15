import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProgramsInOrganizationQueryFn } from "@/lib/api";
import { AllProgramPayloadType } from "@/types/api.type";

const useGetProgramsInOrganizationQuery = ({
  orgId,
  pageSize,
  pageNumber,
  skip = false,
}: AllProgramPayloadType) => {
  const query = useQuery({
    queryKey: ["allPrograms", orgId, pageNumber, pageSize],
    queryFn: () =>
        getProgramsInOrganizationQueryFn({
        orgId,
        pageSize,
        pageNumber,
      }),
    staleTime: Infinity,
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  });
  return query;
};

export default useGetProgramsInOrganizationQuery
