import { Edit3 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditProgramForm from "./edit-program-form";
import { ProgramType } from "@/types/api.type";
import { useState } from "react";

const EditProgramDialog = (props: { program: ProgramType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="mt-1.5" asChild>
          <button>
            <Edit3 className="w-5 h-5" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg border-0">
          <EditProgramForm program={props.program} onClose={onClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProgramDialog;
