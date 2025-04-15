import API from "./axios-client";
import { 
  AllMembersInOrganizationResponseType, 
  AllOrganizationsResponseType, 
  AllProgramPayloadType, 
  AllProgramsResponseType, 
  ChangeOrganizationMemberRoleResponseType, 
  CreateOrganizationResponseType, 
  CreateOrganizationType, 
  CreateProgramType, 
  CurrentUserResponseType, 
  EditOrganizationResponseType, 
  EditOrganizationType, 
  LoginResponseType, 
  loginType, 
  MemberType, 
  OrganizationAnalyticsResponseType, 
  OrganizationByIdResponseType, 
  ProgramAnalyticsResponseType, 
  ProgramResponseType, 
  registerType,
  UpdateProgramType 
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

export const createEventMutationFn = async () => {};

export const getAllEventsQueryFn = async () => {};

export const deleteEventMutationFn = async () => {};
