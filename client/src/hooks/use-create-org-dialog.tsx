import { parseAsBoolean, useQueryState } from "nuqs";

const useCreateOrganizationDialog = () => {
  const [open, setOpen] = useQueryState(
    "new-organization",
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

export default useCreateOrganizationDialog;
