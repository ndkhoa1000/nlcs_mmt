export const EventStatusEnum = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  POSTPONED: "POSTPONED",
} as const;

export const EventPriorityEnum = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export const eventCategoriesEnums = {
  CLIMATE:'CLIMATE',
  ENVIRONMENT:'ENVIRONMENT', 
  SOCIAL:'SOCIAL',
  EDUCATION:'EDUCATION',
  HEALTH:'HEALTH',
  CULTURE:'CULTURE',
  ANIMALS:'ANIMALS',
  COMMUNITY:'COMMUNITY',
  SPORTS:'SPORTS',
  OTHER:'OTHER'
} as const;

export type eventCategoryEnumType = keyof typeof eventCategoriesEnums;
export type EventStatusEnumType = keyof typeof EventStatusEnum;
export type EventPriorityEnumType = keyof typeof EventPriorityEnum;

export const Permissions = {
  CREATE_ORGANIZATION: "CREATE_ORGANIZATION",
    DELETE_ORGANIZATION: "DELETE_ORGANIZATION",
    EDIT_ORGANIZATION: "EDIT_ORGANIZATION",
    MANAGE_ORGANIZATION_SETTINGS: "MANAGE_ORGANIZATION_SETTINGS",
    LEAVE_ORGANIZATION: "LEAVE_ORGANIZATION",
    
    ADD_MEMBER: "ADD_MEMBER",
    CHANGE_MEMBER_ROLE: "CHANGE_MEMBER_ROLE",
    REMOVE_MEMBER: "REMOVE_MEMBER",

    CREATE_PROGRAM: "CREATE_PROGRAM",
    EDIT_PROGRAM: "EDIT_PROGRAM",
    DELETE_PROGRAM: "DELETE_PROGRAM",
    VIEW_PROGRAM: "VIEW_PROGRAM",

    CREATE_EVENT: "CREATE_EVENT",
    EDIT_EVENT: "EDIT_EVENT",
    DELETE_EVENT: "DELETE_EVENT",
    MANAGE_EVENT:"MANAGE_EVENT",

    VIEW_ONLY: "VIEW_ONLY",
} as const;

export type PermissionType = keyof typeof Permissions;
