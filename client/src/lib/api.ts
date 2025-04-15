import API from "./axios-client";
import { 
  AllMembersInOrganizationResponseType, 
  AllOrganizationsResponseType, 
  AllProgramPayloadType, 
  AllProgramsResponseType, 
  AllEventsResponseType,
  AllEventsInOrgResponseType,
  ChangeOrganizationMemberRoleResponseType, 
  CreateOrganizationResponseType, 
  CreateOrganizationType, 
  CreateProgramType, 
  CreateEventType,
  CurrentUserResponseType, 
  EditOrganizationResponseType, 
  EditOrganizationType, 
  EventResponseType,
  LoginResponseType, 
  loginType, 
  MemberType, 
  OrganizationAnalyticsResponseType, 
  OrganizationByIdResponseType, 
  ProgramAnalyticsResponseType, 
  ProgramResponseType, 
  registerType,
  UpdateProgramType,
  UpdateEventType,
  AllEventsPayloadType
} from "@/types/api.type";

export const loginMutationFn = async (data:loginType): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (data: registerType) => {
  return await API.post("/auth/register", data);
};

export const logoutMutationFn = async () => await API.post(`auth/logout`);

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/user/current`);
    return response.data;
  };

//********* ORGANIZATION ****************
//************* */
export const getAllOrganizationsUserIsMemberQueryFn = 
async(): Promise<AllOrganizationsResponseType> => {
  const response = await API.get(`/organization/all`);
  return response.data;
};
export const getOrganizationByIdQueryFn = 
async (orgId: string) :Promise<OrganizationByIdResponseType> => {
  const response = await API.get(`/organization/${orgId}`);
  return response.data
};

export const createOrganizationMutationFn = 
async (data: CreateOrganizationType) : Promise<CreateOrganizationResponseType> => {
  const response = await API.post(`/organization/create/new`, data);
  return response.data
};

export const editOrganizationMutationFn = 
async (data: EditOrganizationType, orgId:string) : Promise<EditOrganizationResponseType> => {
  const response = await API.put(`/organization/update/${orgId}`,data);
  return response.data
};

export const deleteOrganizationMutationFn = 
async (orgId: string) => {
  const response = await API.delete(`/organization/delete/${orgId}`);
  return response.data
};

export const getOrganizationAnalyticsQueryFn = 
async (orgId: string) : Promise<OrganizationAnalyticsResponseType> => {
  const response = await API.get(`/organization/analytics/${orgId}`);
  console.log(response);
  return response.data
};

export const changeOrganizationMemberRoleMutationFn = 
async (orgId:string, data: {roleId: string; memberId: string;})
:Promise<ChangeOrganizationMemberRoleResponseType> => {
  const response = await API.put(`organization/${orgId}/member/role/change`, data);
  return response.data;
};


//******* MEMBER ****************

export const invitedUserJoinOrganizationMutationFn = 
async (inviteCode: string): Promise<{message: string; member: MemberType;}> => {
  const response = await API.post(`/organization/join`,{inviteCode});
  return response.data;
};
export const getAllMemberInOrganizationQueryFn = 
async(orgId:string) :Promise<AllMembersInOrganizationResponseType> => {
  const response = await API.get(`organization/${orgId}/member/all`);
  return response.data
}

//********* */
//********* PROGRAM
export const createProgramMutationFn = 
async (orgId:string,data:CreateProgramType):Promise<ProgramResponseType> => {
  const response = await API.post(`program/organization/${orgId}/create`, data);
  return response.data;
};

export const editProgramMutationFn = 
async (orgId:string,programId:string,data:UpdateProgramType):Promise<ProgramResponseType> => {
  const response = await API.put(`program/${programId}/organization/${orgId}/update`, data);
  return response.data;
};
export const getProgramsInOrganizationQueryFn = 
async ({orgId, pageSize = 5, pageNumber=1} : AllProgramPayloadType)
:Promise<AllProgramsResponseType> => {
  const response = await API.get(`program/organization/${orgId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`);
  return response.data;
};

export const getProgramByIdQueryFn = 
async (orgId:string,programId:string):Promise<ProgramResponseType> => {
  const response = await API.get(`program/${programId}/organization/${orgId}`);
  return response.data;
};

export const getProgramAnalyticsQueryFn = 
async (orgId:string,programId:string):Promise<ProgramAnalyticsResponseType> => {
  const response = await API.get(`program/${programId}/organization/${orgId}/analytics`);
  return response.data;
};

export const deleteProgramMutationFn = 
async (orgId:string,programId:string):Promise<ProgramResponseType> => {
  const response = await API.delete(`program/${programId}/organization/${orgId}/delete`);
  return response.data;
};

//******* EVENT ********************************
//************************* */

export const createEventMutationFn = async (
  orgId: string, 
  data: CreateEventType
): Promise<EventResponseType> => {
  const response = await API.post(`/event/organization/${orgId}/create`, data);
  return response.data;
};

export const getAllEventsQueryFn = async ({
  pageNumber = 1,
  pageSize = 10
} = {}): Promise<AllEventsResponseType> => {
  const queryParams = new URLSearchParams();
  if (pageNumber) queryParams.append("pageNumber", pageNumber.toString());
  if (pageSize) queryParams.append("pageSize", pageSize.toString());

  const url = queryParams.toString() ? `/event/all?${queryParams}` : `/event/all`;
  const response = await API.get(url);
  return response.data;
};

export const getAllEventsInOrgQueryFn = async ({
  orgId,
  programId,
  keyword,
  assignedTo,
  priority,
  status,
  registrationDeadline,
  startTime,
  endTime,
  pageNumber = 1,
  pageSize = 10
}: AllEventsPayloadType): Promise<AllEventsInOrgResponseType> => {
  const baseUrl = `/event/organization/${orgId}/all`;

  const queryParams = new URLSearchParams();
  
  if (programId) queryParams.append("programId", programId);
  if (keyword) queryParams.append("keyword", keyword);
  
  // Handle arrays properly
  if (assignedTo && assignedTo.length > 0) {
    assignedTo.forEach(userId => queryParams.append("assignedTo", userId));
  }
  
  if (priority && priority.length > 0) {
    priority.forEach(p => queryParams.append("priority", p));
  }
  
  if (status && status.length > 0) {
    status.forEach(s => queryParams.append("status", s));
  }
  
  if (registrationDeadline) queryParams.append("registrationDeadline", registrationDeadline);
  if (startTime) queryParams.append("startTime", startTime);
  if (endTime) queryParams.append("endTime", endTime);
  if (pageNumber) queryParams.append("pageNumber", pageNumber.toString());
  if (pageSize) queryParams.append("pageSize", pageSize.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};

export const getEventByIdQueryFn = async (
  orgId: string, 
  eventId: string
): Promise<EventResponseType> => {
  const response = await API.get(`/event/${eventId}/organization/${orgId}`);
  return response.data;
};

export const updateEventMutationFn = async (
  orgId: string,
  eventId: string,
  data: UpdateEventType
): Promise<EventResponseType> => {
  const response = await API.put(`/event/${eventId}/organization/${orgId}/update`, data);
  return response.data;
};

export const deleteEventMutationFn = async (
  orgId: string, 
  eventId: string
): Promise<EventResponseType> => {
  const response = await API.delete(`/event/${eventId}/organization/${orgId}/delete`);
  return response.data;
};
