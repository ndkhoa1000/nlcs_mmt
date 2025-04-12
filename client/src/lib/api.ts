import API from "./axios-client";
import { AllOrganizationsResponseType, CreateOrganizationResponseType, CreateOrganizationType, CurrentUserResponseType, LoginResponseType, loginType, OrganizationByIdResponseType, registerType } from "@/types/api.type";

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

export const editOrganizationMutationFn = async () => {};



export const getOrganizationAnalyticsQueryFn = async () => {};

export const changeOrganizationMemberRoleMutationFn = async () => {};

export const deleteOrganizationMutationFn = async () => {};

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
