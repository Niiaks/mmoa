import { ArrowLeft, Copy, Share, Timer } from "lucide-react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useGetCampaignId } from "@/hooks/campaign/useGetCampaignId";
import Loader from "@/components/Loader";
import { ExtendDialog } from "./components/ui/extendDialog";
import { CloseCampaignDialog } from "./components/ui/closeCampaign";
import { Badge } from "@/components/ui/badge";
import { useGetContributions } from "@/hooks/contribution/useContributions";
import { generatePdf } from "@/lib/exportContributorPdf";
import { toast } from "sonner";

function CampaignDetail() {
  const { id } = useParams();

  const { data, isPending } = useGetCampaignId(id);
  const { data: contributions, isPending: isContributionsPending } =
    useGetContributions(id);

  const campaign = data?.campaign || {};

  const totalRaised = campaign.totalRaised || 0;
  const targetAmount = campaign.targetAmount || 1;

  const progress = Math.min((totalRaised / targetAmount) * 100, 100);

  const contributors = contributions?.contributions || [];

  const recentContributors = contributors
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  const shareLink = campaign.slug
    ? `${window.location.origin}/contribute/${campaign.slug}`
    : "";

  if (isPending || isContributionsPending) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-700">
            mm<span className="text-[#bb4d00]">oa</span>
          </h1>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase text-[#bb4d00]">
                  {campaign.type || "Campaign"}
                </span>

                <Badge
                  variant={
                    campaign.status === "active" ? "default" : "destructive"
                  }
                >
                  {campaign.status || "unknown"}
                </Badge>

                {campaign.deadline && (
                  <span className="ml-auto flex items-center text-xs text-slate-500">
                    <Timer className="h-4 w-4 mr-1" />
                    {new Date(campaign.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                {campaign.title}
              </h2>

              <Progress value={progress} className="h-2 mb-3" />

              <p className="font-semibold">
                GH₵ {totalRaised.toLocaleString()}
                <span className="text-sm text-slate-500 ml-1 font-normal">
                  of GH₵ {targetAmount.toLocaleString()}
                </span>
              </p>
            </div>

            {/* Contributors */}
            <div className="bg-white rounded-xl border p-5 shadow-sm">
              {recentContributors.length > 0 ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h3 className="font-semibold text-slate-900">
                      Recent Contributors
                    </h3>

                    <Button
                      size="sm"
                      onClick={() => generatePdf(campaign, contributors)}
                    >
                      Export PDF
                    </Button>
                  </div>

                  {/* Mobile scroll fix */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {recentContributors.map((col) => (
                          <TableRow key={col._id}>
                            <TableCell>
                              {col.contributorName || "Anonymous"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              GH₵ {col.amount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold mb-2">No contributions yet</h3>
                  <p className="text-sm text-slate-500">
                    Share your campaign to get support.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Share */}
            {campaign.status === "active" && shareLink && (
              <div className="bg-white rounded-xl border p-5 shadow-sm">
                <h3 className="flex items-center gap-2 font-semibold mb-2">
                  <Share className="h-4 w-4 text-[#bb4d00]" />
                  Share Link
                </h3>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    readOnly
                    value={shareLink}
                    className="flex-1 h-10 px-3 border rounded-md text-sm"
                  />

                  <Button
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            {campaign.status !== "expired" && (
              <div className="bg-white rounded-xl border p-5 shadow-sm space-y-3">
                <h3 className="font-semibold">Manage Campaign</h3>

                <Button asChild className="w-full">
                  <Link to={`/withdraw/${campaign._id}`}>Withdraw Funds</Link>
                </Button>

                {campaign.status === "active" && (
                  <ExtendDialog campaign={campaign} />
                )}

                <CloseCampaignDialog campaignId={campaign._id} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CampaignDetail;
