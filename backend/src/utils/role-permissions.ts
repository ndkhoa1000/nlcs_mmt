import {
    Roles,
    Permissions,
    PermissionType,
    RoleType,
  } from "../enums/roles.enums";
  
  export const RolePermissions: Record<RoleType, Array<PermissionType>> = {
    OWNER: [
      Permissions.CREATE_ORGANIZATION,
      Permissions.EDIT_ORGANIZATION,
      Permissions.DELETE_ORGANIZATION,
      Permissions.MANAGE_ORGANIZATION_SETTINGS,
  
      Permissions.ADD_MEMBER,
      Permissions.CHANGE_MEMBER_ROLE,
      Permissions.REMOVE_MEMBER,
  
      Permissions.CREATE_PROGRAM,
      Permissions.EDIT_PROGRAM,
      Permissions.DELETE_PROGRAM,
  
      Permissions.CREATE_EVENT,
      Permissions.EDIT_EVENT,
      Permissions.DELETE_EVENT,
      Permissions.MANAGE_EVENT,
      
      Permissions.VIEW_ONLY,
    ],
    ADMIN: [
      Permissions.ADD_MEMBER,

      Permissions.CREATE_PROGRAM,
      Permissions.EDIT_PROGRAM,
      Permissions.DELETE_PROGRAM,

      Permissions.CREATE_EVENT,
      Permissions.EDIT_EVENT,
      Permissions.DELETE_EVENT,
      Permissions.MANAGE_EVENT,

      Permissions.MANAGE_ORGANIZATION_SETTINGS,
      Permissions.LEAVE_ORGANIZATION,

      Permissions.VIEW_ONLY,
    ],
    MEMBER: [
      Permissions.CREATE_EVENT,
      Permissions.EDIT_EVENT,
      Permissions.LEAVE_ORGANIZATION,
      Permissions.VIEW_ONLY,
    ],
  };