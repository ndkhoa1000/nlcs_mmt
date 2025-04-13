import { Separator } from "@/components/ui/separator";
import OrganizationHeader from "@/components/organization/common/workspace-header";
import EditOrganizationForm from "@/components/organization/edit-org-form";
import DeleteOrgCard from "@/components/organization/settings/delete-org-card";

const Settings = () => {
  return (
    <div className="w-full h-auto py-2">
      <OrganizationHeader />
      <Separator className="my-4 " />
      <main>
        <div className="w-full max-w-3xl mx-auto py-3">
          <h2 className="text-[20px] leading-[30px] font-semibold mb-3">
            Organization settings
          </h2>

          <div className="flex flex-col pt-0.5 px-0 ">
            <div className="pt-2">
              <EditOrganizationForm />
            </div>
            <div className="pt-2">
              <DeleteOrgCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
