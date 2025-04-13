import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-provider";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import useOrgId from "@/hooks/use-org-id";
import { toast } from "@/hooks/use-toast";
import { deleteOrganizationMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const DeleteOrgCard = () => {
  const {organization} = useAuthContext();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const orgId = useOrgId();
  const { open, onOpenDialog, onCloseDialog } = useConfirmDialog();


  const {mutate, isPending} = useMutation({
    mutationFn: deleteOrganizationMutationFn,
  });

  const handleConfirm = () => {
    mutate(orgId, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey:["userOrgs"]
        });
        console.log("delete data:", data);
        
        navigate(`/organization/${data?.currentOrgId}`);
        setTimeout(() => onCloseDialog(), 100);
        toast({
          title: "Success",
          description: "Organization delete successfully.",
          variant: "success",
        });
      },
      onError:(error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to delete organization.",
          variant: "destructive",
        })
      }
    })
  };
  return (
    <>
      <div className="w-full">
        <div className="mb-5 border-b">
          <h1
            className="text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left"
          >
            Delete Organization
          </h1>
        </div>

        <div className="flex flex-col items-start justify-between py-0">
          <div className="flex-1 mb-2">
            <p>
              Deleting a organization is a permanent action and cannot be undone.
              Once you delete a organization, all its associated data, including
              programs, events, and member roles, will be permanently removed.
              Please proceed with caution and ensure this action is intentional.
            </p>
          </div>
          <Button
            className="shrink-0 flex place-self-end h-[40px]"
            variant="destructive"
            onClick={onOpenDialog}
          >
            Delete Organization
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={open}
        isLoading={isPending}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title={`Delete ${organization?.name} Organization`}
        description={`Are you sure you want to delete? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default DeleteOrgCard;
