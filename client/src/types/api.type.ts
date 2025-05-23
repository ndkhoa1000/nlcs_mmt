import {
  EventPriorityEnumType,
  EventStatusEnumType,
  PermissionType,
} from "@/constant";

// AUTH TYPES
export type loginType = { email: string; password: string };
export type LoginResponseType = {
  message: string;
  user: {
    _id: string;
    currentOrganization: string;
  };
};

export type registerType = {
  name: string;
  email: string;
  password: string;
};

// USER TYPE
export type UserType = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  DateOfBirth: Date | null;
  phoneNumber: string | null;
  EmergencyContact: string | null;
  Address: string | null;
  Skills: string | null;
  totalVolunteerHours: number;
  isActive: boolean;
  lastLogin: Date | null;
  createAt: Date;
  updateAt: Date;
  currentOrganization: {
    _id: string;
    name: string;
    owner: string;
    inviteCode?: string;
  } | null;
};

export type UpdateUserProfileType = {
  name?: string;
  profilePicture?: string | null;
  DateOfBirth?: Date;
  phoneNumber?: string;
  Address?: string;
  Skills?: string;
  EmergencyContact?: string;
};

export type CurrentUserResponseType = {
  message: string;
  user: UserType;
};

export type UserProfileResponseType = {
  message: string;
  userProfile: UserType;
};

export type UpdateProfileResponseType = {
  message: string;
  user: UserType;
};

//******** */ ORGANIZATION TYPES ****************
// ******************************************
export type OrganizationType = {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
  description?: string | null;
  mission?: string | null;
  logo?: string | null;
  email?: string | null;
  website?: string | null;
  socialMediaLink?: string[] | null;
  isVerified: boolean;
  establishedDate?: Date | null;
  owner: string;
  inviteCode?: string;
  createAt: Date;
  updateAt: Date;
};

export type CreateOrganizationType = {
  name: string;
  address: string;
  phoneNumber: string;
  description?: string | null;
  mission?: string | null;
  logo?: string | null;
  email?: string | null;
  website?: string | null;
  socialMediaLink?: string[] | null;
  establishedDate?: Date | null;
};

export type EditOrganizationType = {
  name?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  description?: string | null;
  mission?: string | null;
  logo?: string | null;
  email?: string | null;
  website?: string | null;
  socialMediaLink?: string[] | null;
  establishedDate?: Date | null;
};

export type CreateOrganizationResponseType = {
  message: string;
  organization: OrganizationType;
};
export type EditOrganizationResponseType = {
  message: string;
  organization: OrganizationType;
};
export type AllOrganizationsResponseType = {
  message: string;
  organizations: OrganizationType[];
};

export type OrganizationWithMembersType = OrganizationType & {
  members: {
    _id: string;
    userId: {
      _id:string;
      name:string;
      email: string;
      profilePicture: string | null;
    };
    orgId: string;
    role: {
      _id: string;
      name: string;
      // NOTE: for fix type: fix from roles in BE and then comeback to FE those files:
      // NOTE: use-permission, *permission*.ts.ts
      permission: PermissionType[];
    };
    isApproved: boolean;
    volunteerHours: number;
    joinAt: Date;
    createAt: Date;
    updateAt: Date;
  }[];
};


export type OrganizationByIdResponseType = {
  message: string;
  organization: OrganizationWithMembersType;
};

export type OrganizationAnalyticsResponseType = {
  message: string;
  analysis: {
    totalProgram: number;
    totalEvent: number;
    totalPendingEvent: number;
    totalActiveEvent: number;
    totalCompleteEvent: number;
    totalPostponedEvent: number;
  };
};

export type PaginationType = {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  skip: number;
  limit: number;
};

// ROLE & PERMISSION TYPES
export type RoleType = {
  _id: string;
  name: string;
};
// *********** MEMBER ****************

export type MemberType = {
  _id: string;
  userId: string;
  orgId: string;
  role: {
    _id: string;
    name: string;
    permission: PermissionType[];
  };
  isApproved: boolean;
  volunteerHours: number;
  joinAt: Date;
  createAt: Date;
  updateAt: Date;
};

export type AllMembersInOrganizationResponseType = {
  message: string;
  members: {
    _id: string;
    userId: {
      _id:string;
      name:string;
      email: string;
      profilePicture: string | null;
    };
    orgId: string;
    role: {
      _id: string;
      name: string;
      permission: PermissionType[];
    };
    isApproved: boolean;
    volunteerHours: number;
    joinAt: Date;
    createAt: Date;
    updateAt: Date;
  }[];
  roles: RoleType[];
};

export type ChangeOrganizationMemberRoleResponseType = {
  message: string;
  member: MemberType;
};

export type JoinOrganizationType = {
  inviteCode: string;
};

//******** */ PROGRAM ****************
//****************************************** */
export type ProgramType = {
  _id: string;
  name: string;
  description: string | null;
  organization: string;
  startDate: Date | null;
  endDate: Date | null;
  sponsors: string[] | null;
  documents: string[];
  createBy: {
    _id: string;
    name: string;
    profilePicture: string | null;
  };
  createAt: Date;
  updateAt: Date;
};


export type CreateProgramType = {
  name: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  sponsors?: string[] | null;
  documents?: string[] | null;
};



export type ProgramResponseType =  {
  message: string;
  program: ProgramType;
};


export type UpdateProgramType = {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  sponsors?: string[];
  documents?: string[];
};


export type ProgramAnalyticsResponseType = {
  message: string;
  analysis: {
    totalEvent: number;
    totalPendingEvent: number;
    totalActiveEvent: number;
    totalCompleteEvent: number;
    totalPostponedEvent: number;
  };
};

// NOTE: for pagination.
//ALL PROGRAM IN ORG TYPE
export type AllProgramPayloadType = {
  orgId: string;
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  skip?: boolean;
};

export type AllProgramsResponseType = {
  message: string;
  programs: ProgramType[];
  pagination: PaginationType; 
};

//********** */ EVENT TYPES ************************
//************************************************* */

export type EventType = {
  _id: string;
  title: string;
  description: string | null;
  program: {
    _id: string;
    name: string;
  } | null;
  organization: string;
  category: string[];
  location: string;
  status: EventStatusEnumType;
  priority: EventPriorityEnumType;
  assignedTo: {
    _id: string;
    name: string;
    profilePicture: string | null;
  }[];
  cohost: string[];
  requiredVolunteer: number;
  registeredVolunteer: number;
  registrationDeadline: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  documents: string[];
  needTraining: boolean;
  createBy: {
    _id: string;
    name: string;
    profilePicture: string | null;
  };
  createAt: Date;
  updateAt: Date;
};

export type CreateEventType = {
  title: string;
  description?: string | null;
  program?: string | null;
  category?: string[];
  location: string;
  status?: EventStatusEnumType;
  priority?: EventPriorityEnumType;
  assignedTo?: string[] | [];
  cohost?: string[] | [];
  requiredVolunteer: number;
  registrationDeadline?: Date |null;
  startTime?: Date | null;
  endTime?: Date | null;
  documents?: string[];
  needTraining?: boolean;
};

export type UpdateEventType = {
  title?: string;
  description?: string | null;
  program?: string | null;
  category?: string[];
  location?: string;
  status?: string;
  priority?: string;
  assignedTo?: string[];
  cohost?: string[];
  requiredVolunteer?: number;
  registrationDeadline?: Date;
  startTime?: Date | null;
  endTime?: Date | null;
  documents?: string[];
  needTraining?: boolean;
};

export type EventResponseType = {
  message: string;
  event: EventType;
};

export type AllEventsResponseType = {
  message: string;
  events: EventType[];
};

export type AllEventsInOrgResponseType = {
  message: string;
  events: EventType[];
  pagination: PaginationType;
};

export type AllEventsPayloadType = {
  orgId: string;
  programId?: string;
  keyword?: string;
  status?: string[];
  priority?: string[];
  assignedTo?: string[];
  registrationDeadline?: string;
  startTime?: string;
  endTime?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type AllTaskPayloadType ={
  orgId: string;
  programId?: string | null;

  priority?: EventPriorityEnumType| null;
  status?: EventStatusEnumType | null;
  registrationDeadline?: string | null;
  assignedTo?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  
  keyword?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
}
//*****************ATTENDANCE TYPES**********************/
export type AttendanceType = {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    startTime: Date | null;
    endTime: Date | null;
    organization?: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
    profilePicture: string | null;
  };
  isPresent: boolean;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  hoursContributed: number;
  feedback: string | null;
  createAt: Date;
  updateAt: Date;
};

export type CreateAttendanceType = {
  isPresent?: boolean;
  checkInTime?: Date | null;
  checkOutTime?: Date | null;
  hoursContributed?: number;
  feedback?: string | null;
};

export type UpdateAttendanceType = {
  isPresent?: boolean;
  checkInTime?: Date;
  checkOutTime?: Date;
  hoursContributed?: number;
  feedback?: string;
};

export type AttendanceResponseType = {
  message: string;
  attendance: AttendanceType;
};

export type AllAttendancesResponseType = {
  message: string;
  attendances: AttendanceType[];
};

// ENUM RESPONSE TYPES
export type EventStatusEnumsResponseType = {
  message: string;
  eventStatuses: string[];
};

export type EventPriorityEnumsResponseType = {
  message: string;
  eventPriorities: string[];
};

export type EventCategoriesEnumsResponseType = {
  message: string;
  eventCategories: string[];
};

// Mapping from old names to new structures for backward compatibility
export type WorkspaceType = OrganizationType;
export type WorkspaceWithMembersType = OrganizationWithMembersType;
export type ProjectType = ProgramType;
export type TaskType = EventType;

// Compatibility types for frontend that may still use these
export type AllWorkspaceResponseType = AllOrganizationsResponseType;
export type WorkspaceByIdResponseType = OrganizationByIdResponseType;
export type AnalyticsResponseType = OrganizationAnalyticsResponseType;
export type AllProjectResponseType = {
  message: string;
  projects: ProgramType[];
  pagination?: PaginationType;
};
export type AllTaskResponseType = {
  message: string;
  tasks: EventType[];
  pagination?: PaginationType;
};