import { getAllMemberInOrganizationQueryFn} from "@/lib/api";
import { AllMembersInOrganizationResponseType } from "@/types/api.type";
import { CustomError } from "@/types/custom-error.type";
import { useQuery } from "@tanstack/react-query";

const useGetAllMemberInOrganizationQuery = (orgId :string) => {
    const  query = useQuery<AllMembersInOrganizationResponseType, CustomError>({
        queryKey: ["Members", orgId],
        queryFn: () => getAllMemberInOrganizationQueryFn(orgId),
        staleTime: Infinity,
    })
    return query;
};

export default useGetAllMemberInOrganizationQuery;
