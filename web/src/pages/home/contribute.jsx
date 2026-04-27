import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useParams } from "react-router";
import { useGetCampaignSlug } from "@/hooks/campaign/useGetCampaignSlug";
import { useState } from "react";
import Loader from "@/components/Loader";
import { useContribute } from "@/hooks/contribution/useContribute";
import { toast } from "sonner";
import { validate } from "@/validation/validate";
import { schemas } from "@/validation/schema";
import * as z from "zod"

function Contribute() {
  const { slug } = useParams();

  const { data, isPending } = useGetCampaignSlug(slug);

  const { mutate: contribute, isPending: isContributePending } =
    useContribute();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});

  const campaign = data?.campaign || {};

  const contributorNameRequired = data?.meta?.requireContributorName;

  const progress = Math.min(
    (campaign.amountRaised / campaign.targetAmount) * 100,
    100,
  );

  if (isPending) {
    return <Loader />;
  }

  const handleContribute = (e) => {
    e.preventDefault();

    const { valid, errors: fieldErrors } = validate(
      contributorNameRequired
        ? schemas.contributeToCampaignSchema.extend({
          contributorName: z.string().min(1, "Name is required"),
        })
        : schemas.contributeToCampaignSchema, {
      contributorName: contributorNameRequired ? name : undefined,
      contributorEmail: email,
      amount: Number(amount),
    },
    );

    if (!valid) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    contribute(
      {
        campaignId: campaign.id,
        contributorName: contributorNameRequired ? name : undefined,
        contributorEmail: email,
        amount: Number(amount),
      },
      {
        onSuccess: (response) => {
          toast.success(
            "Contribution initiated! Continue to complete your payment.",
          );
          setName("");
          setEmail("");
          setAmount("");

          window.open(response.data.authorizationUrl, "_self");
        },
      },
    );
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto max-w-5xl px-6 sm:px-12 w-full pt-8 pb-16">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-muted-foreground">
            mm<span className="text-[#bb4d00]">oa</span>
          </h1>
        </header>

        {/* Centered Content */}
        <section className="mt-6 flex flex-col items-center justify-center">
          {/* Contribution Card */}
          <Card className="w-full max-w-sm border border-muted-foreground">
            <CardHeader>
              <span className="text-xs font-semibold uppercase text-[#bb4d00]">
                {campaign.type}
              </span>

              <CardTitle className="text-xl">{campaign.title}</CardTitle>

              <CardDescription className="text-sm">
                {campaign.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="flex flex-col gap-4" onSubmit={handleContribute}>
                {contributorNameRequired && (
                  <div className="grid gap-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (GH₵)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                  />
                  {errors.amount && (
                    <p className="text-xs text-red-500">{errors.amount}</p>
                  )}
                </div>

                {/* Quick amounts */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(50)}
                  >
                    50
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(100)}
                  >
                    100
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(200)}
                  >
                    200
                  </Button>
                </div>
                <Button
                  className="w-full"
                  type="submit"
                  disabled={isContributePending}
                >
                  {isContributePending ? "Processing..." : "Contribute"}
                </Button>
                <p className="text-xs text-center text-slate-500">
                  fee included · Powered by Paystack
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Stats (compact + secondary) */}
          <div className="w-full max-w-sm mt-6">
            <div className="bg-white border border-muted-foreground rounded-2xl p-6 shadow-sm">
              <p className="text-lg font-semibold">
                GH₵ {campaign.amountRaised}
                <span className="text-sm text-slate-500 font-normal ml-1">
                  of GH₵ {campaign.targetAmount} goal
                </span>
              </p>

              <Progress value={progress} className="h-2 mt-3 mb-3" />

              <p className="text-sm text-slate-600">
                {campaign.numberOfContributors} contributors
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Contribute;
