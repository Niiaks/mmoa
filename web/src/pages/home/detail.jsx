import { ArrowLeft, Copy, Share } from "lucide-react";
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

function CampaignDetail() {
  const { id } = useParams();

  const { data, isPending } = useGetCampaignId(id);
  const { data: contributions, isPending: isContributionsPending } =
    useGetContributions(id);

  const campaign = data?.campaign || {};

  const progress = Math.min(
    ((campaign.totalRaised || 0) / (campaign.targetAmount || 1)) * 100,
    100,
  );

  const recentContributors = contributions?.contributions
    ? contributions.contributions
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
    : [];

  if (isPending || isContributionsPending) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto max-w-5xl px-6 sm:px-12 w-full pt-8 pb-16">
        {/* Header */}
        <header className="flex items-center justify-between py-6 mb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-muted-foreground">
            mm<span className="text-[#bb4d00]">oa</span>
          </h1>
          <Link
            to="/dashboard"
            className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </header>

        <div
          className={`grid ${campaign.status === "active" ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-3"} gap-6`}
        >
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6 items-center">
            {/* Summary Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold uppercase text-[#bb4d00]">
                  {campaign.type}
                </span>
                <Badge
                  variant={
                    campaign.status === "active" ? "default" : "destructive"
                  }
                  className="text-xs font-semibold"
                >
                  {campaign.status}
                </Badge>
              </div>

              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {campaign.title}
              </h2>

              <Progress value={progress} className="h-2 mb-3" />

              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">
                  GH₵ {campaign.totalRaised}
                  <span className="text-sm text-slate-500 font-normal ml-1">
                    of GH₵ {campaign.targetAmount} goal
                  </span>
                </p>
              </div>
            </div>
            {/* Contributors */}
            {recentContributors.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Recent Contributors
                  </h3>
                  <Button
                    onClick={() => {
                      generatePdf(campaign, contributions?.contributions || []);
                    }}
                    size="lg"
                  >
                    Export as Pdf
                  </Button>
                </div>

                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {recentContributors.map((col) => (
                      <TableRow key={col._id}>
                        <TableCell className="font-medium text-slate-800">
                          {col.contributorName || "Anonymous"}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          GH₵ {col.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Share Card */}
            {campaign.status === "active" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Share className="h-4 w-4 text-[#bb4d00]" />
                  Share Link
                </h3>

                <p className="text-sm text-slate-600 mb-4">
                  Anyone with this link can contribute.
                </p>

                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/contribute/${campaign.slug}`}
                    className="flex-1 min-w-0 h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#bb4d00]"
                  />

                  <Button
                    size="icon"
                    className="shrink-0"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/contribute/${campaign.slug}`,
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            {campaign.status === "active" && campaign.status !== "expired" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Manage Campaign
                </h3>

                {/* Primary Action */}
                <Button size="lg">Withdraw Funds</Button>

                {/* Secondary */}
                {campaign.status !== "expired" && (
                  <ExtendDialog campaignId={campaign._id} />
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
