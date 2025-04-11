export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
  GOOGLE_OAUTH_CALLBACK: "/google/oauth/callback",
};

export const PROTECTED_ROUTES = {
  ORGANIZATION: "/organization/:orgId",
  EVENTS: "/organization/:orgId/tasks",
  MEMBERS: "/organization/:orgId/members",
  SETTINGS: "/organization/:orgId/settings",
  PROGRAM_DETAILS: "/organization/:orgId/program/:programId",
};

export const BASE_ROUTE = {
  INVITE_URL: "/invite/organization/:inviteCode/join",
};
