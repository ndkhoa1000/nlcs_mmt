import WorkspaceForm from "./create-org-form";
import useCreateOrganizationDialog from "@/hooks/use-create-org-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
const CreateOrganizationDialog = () => {
  const { open, onClose } = useCreateOrganizationDialog();

  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl !p-0 overflow-hidden border-0">
        <WorkspaceForm {...{onClose}}/>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrganizationDialog;
