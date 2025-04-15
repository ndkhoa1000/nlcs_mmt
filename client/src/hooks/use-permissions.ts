import { PermissionType } from "@/constant";
import { OrganizationWithMembersType, UserType} from "@/types/api.type";
import { useEffect, useMemo, useState } from "react";

const usePermissions = (
  user: UserType | undefined,
  organization: OrganizationWithMembersType | undefined
) => {
  const [permissions, setPermissions] = useState<PermissionType[]>([]);

  useEffect(() => {
    if (user && organization) {
      const member = organization.members.find(
        (member) => {
            return member.userId._id === user._id}
      );
      if (member) {
        setPermissions(member.role.permission || []);
        console.log("user permission:", permissions);
      }
    }
  }, [user, organization, permissions]);

  return useMemo(() => permissions, [permissions]);
};

export default usePermissions;
