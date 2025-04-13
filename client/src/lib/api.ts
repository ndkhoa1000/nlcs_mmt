import API from "./axios-client";
import { AllOrganizationsResponseType, CreateOrganizationResponseType, CreateOrganizationType, CurrentUserResponseType, EditOrganizationResponseType, EditOrganizationType, LoginResponseType, loginType, OrganizationAnalyticsResponseType, OrganizationByIdResponseType, registerType } from "@/types/api.type";

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

export const changeOrganizationMemberRoleMutationFn = async () => {};


//******* MEMBER ****************

export const invitedUserJoinOrganizationMutationFn = async () => {};

//********* */
//********* PROGRAM
export const createProjectMutationFn = async () => {};

export const editProjectMutationFn = async () => {};

export const getProjectsInOrganizationQueryFn = async () => {};

export const getProjectByIdQueryFn = async () => {};

export const getProjectAnalyticsQueryFn = async () => {};

export const deleteProjectMutationFn = async () => {};

//******* EVENT ********************************
//************************* */

export const createTaskMutationFn = async () => {};

export const getAllTasksQueryFn = async () => {};

export const deleteTaskMutationFn = async () => {};
