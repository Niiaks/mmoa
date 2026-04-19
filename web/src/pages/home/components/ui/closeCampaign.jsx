import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCloseCampaign } from "@/hooks/campaign/useCloseCampaign";
import { useState } from "react";

export function CloseCampaignDialog({ campaignId }) {
  const [open, setOpen] = useState(false);

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
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          Close Campaign
        </Button>
      </AlertDialogTrigger>
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
