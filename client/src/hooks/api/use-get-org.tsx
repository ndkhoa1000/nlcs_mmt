import { getOrganizationByIdQueryFn } from "@/lib/api";
import { CustomError } from "@/types/custom-error.type";
import { useQuery } from "@tanstack/react-query";

const useGetOrganizationQuery = (orgId :string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const  query = useQuery<any, CustomError>({
        queryKey: ["Organization", orgId],
        queryFn: () => getOrganizationByIdQueryFn(orgId),
        staleTime:0,
        retry: 2,
        enabled: !!orgId,
    })
    return query;
};

export default useGetOrganizationQuery;
