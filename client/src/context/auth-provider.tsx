/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect } from "react";
import useOrgId from "@/hooks/use-org-id";
import useAuth from "@/hooks/api/use-auth";
import { OrganizationType, UserType } from "@/types/api.type";
import useGetOrganizationQuery from "@/hooks/api/use-get-org";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import usePermissions from "@/hooks/use-permissions";
import { PermissionType } from "@/constant";

// Define the context shape
type AuthContextType = {
  organization?: OrganizationType;
  user?: UserType;
  hasPermission: (permission: PermissionType) => boolean;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  refetchAuth: () => void;
  refetchOrg: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const {
    data: authData,
    error: authError,
    isLoading: authLoading,
    isFetching,
    refetch: refetchAuth
  } = useAuth();
  const user = authData?.user;
  
  const orgId = useOrgId();
  const {
    data: orgData,
    error: orgError,
    isLoading: orgLoading,
    refetch: refetchOrg,
  } = useGetOrganizationQuery(orgId);
  console.log('orgError:', orgError)
  const organization = orgData?.organization;
  useEffect(() => {
    if (orgError) {
      if (orgError?.errorCode === "ACCESS_UNAUTHORIZED") {
        toast({
          title:"Error",
          description:orgError?.response?.data?.message,
          variant:"destructive",
        })
        navigate("/"); // Redirect if the user is not a member of the workspace
      }
    }
  }, [navigate, orgError]);

  const permissions = usePermissions(user, organization);

  const hasPermission = (permission:PermissionType): boolean =>{
    return permissions.includes(permission);
  }; 
  return (
    <AuthContext.Provider
      value={{
        organization,
        user,
        hasPermission,
        error: authError ||orgError,
        isLoading: authLoading || orgLoading,
        isFetching,
        refetchAuth,
        refetchOrg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCurrentUserContext must be used within a AuthProvider");
  }
  return context;
};
