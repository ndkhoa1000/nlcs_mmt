import { Separator } from "@/components/ui/separator";
import InviteMember from "@/components/organization/member/invite-member";
import AllMembers from "@/components/organization/member/all-members";
import OrganizationHeader from "@/components/organization/common/workspace-header";

export default function Members() {
  return (
    <div className="w-full h-auto pt-2">
      <OrganizationHeader />
      <Separator className="my-4 " />
      <main>
        <div className="w-full max-w-3xl mx-auto pt-3">
          <div>
            <h2 className="text-lg leading-[30px] font-semibold mb-1">
              Organization members
            </h2>
            <p className="text-sm text-muted-foreground">
              Organization members can view and join all Organization program, tasks
              and create new task in the Organization.
            </p>
          </div>
          <Separator className="my-4" />

          <InviteMember />
          <Separator className="my-4 !h-[0.5px]" />

          <AllMembers />
        </div>
      </main>
    </div>
  );
}
