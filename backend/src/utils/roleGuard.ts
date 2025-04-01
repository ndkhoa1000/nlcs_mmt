import { PermissionType } from "../enums/roles.enums";
import { UnauthorizedException } from "./appError";
import { RolePermissions } from "./role-permissions";

export const roleGuard = (
    userRole: keyof typeof RolePermissions,
    requiredPermission: PermissionType[]
) => {
    const userPermissions= RolePermissions[userRole];
    const hasPermission = requiredPermission.every((permission) => userPermissions.includes(permission))
    
    if(!hasPermission)
        throw new UnauthorizedException("You do not have the necessary permissions to perform this action")
}