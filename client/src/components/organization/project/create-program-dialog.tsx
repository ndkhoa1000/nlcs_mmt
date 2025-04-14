import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateProgramForm from "@/components/organization/project/create-program-form";
import useCreateProgramDialog from "@/hooks/use-create-project-dialog";

const CreateProgramDialog = () => {
  const { open, onClose } = useCreateProgramDialog();
  return (
    <div>
      <Dialog modal={true} open={open} onOpenChange={onClose}>
        <DialogContent title="program-form" className="sm:max-w-lg border-0">
          <CreateProgramForm {...{onClose}}/>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProgramDialog;
