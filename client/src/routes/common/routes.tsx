import GoogleOAuthFailure from "@/page/auth/GoogleOAuthFailure";
import SignIn from "@/page/auth/Sign-in";
import SignUp from "@/page/auth/Sign-up";
import OrganizationDashboard from "@/page/organization/Dashboard";
import Members from "@/page/organization/Members";
import ProjectDetails from "@/page/organization/ProjectDetails";
import Settings from "@/page/organization/Settings";
import Tasks from "@/page/organization/Tasks";
import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from "./routePaths";
import InviteUser from "@/page/invite/InviteUser";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.ORGANIZATION, element: <OrganizationDashboard /> },
  { path: PROTECTED_ROUTES.EVENTS, element: <Tasks /> },
  { path: PROTECTED_ROUTES.MEMBERS, element: <Members /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
  { path: PROTECTED_ROUTES.PROGRAM_DETAILS, element: <ProjectDetails /> },
];

export const baseRoutePaths = [
  { path: BASE_ROUTE.INVITE_URL, element: <InviteUser /> },
];
