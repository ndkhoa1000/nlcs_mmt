import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import useCreateProgramDialog from "@/hooks/use-create-project-dialog";
import OrganizationAnalytics from "@/components/organization/org-analysics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentPrograms from "@/components/organization/program/recent-programs";
import RecentTasks from "@/components/organization/event/recent-tasks";
import RecentMembers from "@/components/organization/member/recent-members";
const OrganizationDashboard = () => {
  const { onOpen } = useCreateProgramDialog();
  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Organization Overview
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s an overview for this organization!
          </p>
        </div>
        <Button onClick={onOpen}>
          <Plus />
          New Program
        </Button>
      </div>
      <OrganizationAnalytics />
      <div className="mt-4">
        <Tabs defaultValue="projects" className="w-full border rounded-lg p-2">
          <TabsList className="w-full justify-start border-0 bg-gray-50 px-1 h-12">
            <TabsTrigger className="py-2" value="projects">
              Recent Programs
            </TabsTrigger>
            <TabsTrigger className="py-2" value="tasks">
              Recent Events
            </TabsTrigger>
            <TabsTrigger className="py-2" value="members">
              Recent Members
            </TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <RecentPrograms />
          </TabsContent>
          <TabsContent value="tasks">
            <RecentTasks />
          </TabsContent>
          <TabsContent value="members">
            <RecentMembers />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default OrganizationDashboard;
