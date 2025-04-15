import GoogleOAuthFailure from "@/page/auth/GoogleOAuthFailure";
import SignIn from "@/page/auth/Sign-in";
import SignUp from "@/page/auth/Sign-up";
import OrganizationDashboard from "@/page/organization/Dashboard";
import Members from "@/page/organization/Members";
import ProgramDetails from "@/page/organization/ProgramDetails";
import SettingsWithPermissions from "@/page/organization/Settings";
import Events from "@/page/organization/Events";
import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from "./routePaths";
import InviteUser from "@/page/invite/InviteUser";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.ORGANIZATION, element: <OrganizationDashboard /> },
  { path: PROTECTED_ROUTES.EVENTS, element: <Events /> },
  { path: PROTECTED_ROUTES.MEMBERS, element: <Members /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <SettingsWithPermissions /> },
  { path: PROTECTED_ROUTES.PROGRAM_DETAILS, element: <ProgramDetails /> },
];

export const baseRoutePaths = [
  { path: BASE_ROUTE.INVITE_URL, element: <InviteUser /> },
];
