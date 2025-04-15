import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditEventForm from "./edit-event-form";

interface EditEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

const EditEventDialog = ({ isOpen, onClose, eventId }: EditEventDialogProps) => {
  return (
    <Dialog modal={true} open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
        <EditEventForm eventId={eventId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
