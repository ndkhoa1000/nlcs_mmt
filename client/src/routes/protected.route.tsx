import useAuth from "@/hooks/api/use-auth";
import { Navigate, Outlet } from "react-router-dom";
import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
const ProtectedRoute = () => {
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
