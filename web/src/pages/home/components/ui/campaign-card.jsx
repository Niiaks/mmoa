import { Badge } from "@/components/ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router";
import { CloseCampaignDialog } from "./closeCampaign";
import { useState } from "react";
import { toast } from "sonner";

function CampaignCard({
  id,
  type,
  status,
  title,
  createdAgo,
  raised,
  goal,
  slug,
}) {
  const progress = Math.min(((raised || 0) / (goal || 1)) * 100, 100);

  const [openCloseDialog, setOpenCloseDialog] = useState(false);

  const shareLink = `${window.location.origin}/contribute/${slug}`;

  const navigate = useNavigate();
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            onClick={() => navigate(`/campaign/${id}/details`)}
            className="border border-muted-foreground rounded-2xl p-5 w-full max-w-sm cursor-pointer  bg-white"
          >
            {/* Row 1: Type badge + Status badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-[#bb4d00]">
                {type}
              </span>
              <Badge variant={status === "active" ? "default" : "destructive"}>
                {status}
              </Badge>
            </div>

            {/* Row 2: Campaign title */}
            <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>

            {/* Row 3: Meta info */}
            <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
              Created {createdAgo}
            </p>

            {/* Progress bar */}
            <Progress value={progress} />

            {/* Row 4: Raised amount (left) / Goal amount (right) */}
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-slate-900">
                GH₵ {raised.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500">
                of GH₵ {goal.toLocaleString()}
              </span>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem asChild>
            <Link
              className="w-full cursor-pointer"
              to={`/campaign/${id}/details`}
            >
              View Campaign
            </Link>
          </ContextMenuItem>
          <ContextMenuItem
            className="cursor-pointer"
            onClick={() => setOpenCloseDialog(true)}
          >
            Close Campaign
          </ContextMenuItem>
          <ContextMenuItem
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(shareLink);
              toast.success("Link copied to clipboard!");
            }}
          >
            Share Link
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <CloseCampaignDialog
        campaignId={id}
        open={openCloseDialog}
        setOpen={setOpenCloseDialog}
      />
    </>
  );
}

export default CampaignCard;
