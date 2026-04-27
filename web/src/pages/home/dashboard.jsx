import { DropdownMenuDemo } from "./components/ui/dropdown";
import { EmptyDemo } from "./components/ui/empty";
import CampaignCard from "./components/ui/campaign-card";
import { CreateCampaignDialog } from "./components/ui/create-campaign-dialog";
import { useOrganizerCampaign } from "@/hooks/campaign/useOrganizerCampaign";
import { timeSince } from "@/lib/timeAgo";
import Loader from "@/components/Loader";

function Dashboard() {
  const { data, isPending } = useOrganizerCampaign();

  const campaigns = data?.campaign || [];

  if (isPending) {
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
          <DropdownMenuDemo />
        </header>

        {campaigns && campaigns.length > 0 ? (
          <section className="mt-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Your Campaigns
                </h2>
                <p className="text-sm text-slate-500">
                  Manage and track your campaigns
                </p>
              </div>

              {/* Primary CTA */}
              <CreateCampaignDialog />
            </div>

            {/* Campaign Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {campaigns.map((campaign) => (
                <CampaignCard
                  id={campaign._id}
                  key={campaign._id}
                  campaign={campaign}
                  title={campaign.title}
                  type={campaign.type}
                  status={campaign.status}
                  goal={campaign.targetAmount}
                  raised={campaign.totalRaised}
                  createdAgo={timeSince(campaign.createdAt)}
                  slug={campaign.slug}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="mt-10">
            <EmptyDemo />
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
