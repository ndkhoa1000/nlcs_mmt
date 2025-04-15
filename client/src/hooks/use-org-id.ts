import { useParams } from "react-router-dom";

const useOrgId = () => {
  const params = useParams();
  return params.orgId as string;
};

export default useOrgId;
