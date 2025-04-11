/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";
import useOrgId from "@/hooks/use-org-id";
import useAuth from "@/hooks/api/use-auth";
import { OrganizationType, UserType } from "@/types/api.type";
import useGetOrganizationQuery from "@/hooks/api/use-get-org";

// Define the context shape
type AuthContextType = {
  organization?: OrganizationType;
  user?: UserType;
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

  return (
    <AuthContext.Provider
      value={{
        organization,
        user,
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
