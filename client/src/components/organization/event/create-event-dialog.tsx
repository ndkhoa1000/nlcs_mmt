import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateEventForm from "./create-event-form";
import { useState } from "react";

const CreateEventDialog = (props: { programId?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button>
            <Plus />
            New Event
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
          <CreateEventForm programId={props.programId} onClose={onClose}/>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEventDialog;
