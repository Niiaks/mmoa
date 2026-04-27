import { useState } from "react";
import { ArrowLeft, Wallet, Phone } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { DropdownMenuDemo } from "./components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGetCampaignId } from "@/hooks/campaign/useGetCampaignId";
import { useWithdrawal } from "@/hooks/withdrawal/useWithdrawal";
import { usePreviewWithdrawal } from "@/hooks/withdrawal/usePreviewWithdrawal";
import Loader from "@/components/Loader";

function Withdraw() {
  const [momoNumber, setMomoNumber] = useState("");
  const { id } = useParams();
  const { data } = useGetCampaignId(id);
  const { mutate: withdraw, isPending } = useWithdrawal();
  const { data: previewWithdrawal, isLoading: isPreviewLoading } =
    usePreviewWithdrawal(id);

  const campaign = data?.campaign;
  const preview = previewWithdrawal?.breakdown;
  const navigate = useNavigate();

  const handleWithdraw = (e) => {
    e.preventDefault();

    withdraw(
      {
        campaignId: id,
        momoNumber: momoNumber,
      },
      {
        onSuccess: () => {
          setMomoNumber("");
        },
      },
    );
  };

  if (isPreviewLoading) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen">
      <main className="container mx-auto max-w-5xl px-6 sm:px-12 w-full pt-8 pb-16">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-muted-foreground">
            mm<span className="text-[#bb4d00]">oa</span>
          </h1>
          <div className="flex items-center gap-4 flex-row">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <DropdownMenuDemo />
          </div>
        </header>

        {/* Content — centered, compact */}
        <section className="mt-4 flex flex-col items-center">
          <div className="w-full max-w-sm space-y-5">
            {/* ── Dark hero card ── */}
            <div className="rounded-2xl bg-[#4b2205] p-6 text-white shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Available to withdraw
                </span>
              </div>

              <p className="text-3xl font-bold tracking-tight text-[#e8873a]">
                GH₵ {preview?.availableBalance || 0}
              </p>

              <p className="mt-2 text-sm text-slate-400">{campaign?.title}</p>
            </div>

            {/* ── Breakdown card ── */}
            <div className="rounded-2xl border border-muted-foreground bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Withdrawal summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total raised</span>
                  <span className="font-medium text-slate-800">
                    GH₵ {preview?.totalRaised || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Platform fee (2.5%)</span>
                  <span className="font-medium text-slate-800">
                    GH₵ {preview?.platformFee || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Paystack Momo fee</span>
                  <span className="font-medium text-slate-800">
                    GH₵ {preview?.paystackMoMoFee || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total fees</span>
                  <span className="font-medium text-slate-800">
                    GH₵ {preview?.totalFees || 0}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    You receive
                  </span>
                  <span className="font-bold text-[#bb4d00]">
                    GH₵ {preview?.amountYouWillReceive || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* ── MoMo input ── */}
            <div className="rounded-2xl border border-muted-foreground bg-white p-6 shadow-sm">
              <Label
                htmlFor="momo"
                className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3"
              >
                <Phone className="h-4 w-4 text-[#bb4d00]" />
                MoMo number
              </Label>

              <Input
                id="momo"
                type="tel"
                placeholder="024 000 0000"
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
              />
            </div>

            {/* ── CTA ── */}
            <Button
              onClick={handleWithdraw}
              className="w-full"
              size="lg"
              disabled={!momoNumber || isPending || !preview?.canWithdraw}
            >
              {isPending
                ? "withdrawing..."
                : `Withdraw GH₵ ${preview?.amountYouWillReceive || 0}`}
            </Button>

            <p className="text-xs text-center text-slate-400">
              Funds sent directly to your MoMo. Usually instant.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Withdraw;
