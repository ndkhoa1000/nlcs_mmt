import { parseAsBoolean, useQueryState } from "nuqs";

const useCreateProgramDialog = () => {
  const [open, setOpen] = useQueryState(
    "new-program",
    parseAsBoolean.withDefault(false)
  );
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return {
    open,
    onOpen,
    onClose,
  };
};

export default useCreateProgramDialog;
