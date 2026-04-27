import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCloseCampaign } from "@/hooks/campaign/useCloseCampaign";

export function CloseCampaignDialog({ campaignId, open, setOpen }) {
  const { mutate: closeCampaign, isPending } = useCloseCampaign(campaignId);

  const handleSubmit = (e) => {
    e.preventDefault();
    closeCampaign(null, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently close the
            campaign and remove it from the list of active campaigns. Make sure
            to withdraw any remaining funds before closing.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            {isPending ? "Closing..." : "Yes, close it"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
