import { ArrowLeft, Edit3, Share2, Heart } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

function HowItWorks() {
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

        {/* Content Box */}
        <div className=" p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight text-muted-foreground mb-5">
              How mmoa works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              mmoa makes it incredibly simple to raise funds for the causes you
              care about. When the unexpected happens, we're here to help you
              rally your community safely and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="bg-[#bb4d00] bg-opacity-10 text-[#bb4d00] p-5 rounded-full mb-6">
                <Edit3 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-muted-foreground mb-3">
                1. Start a Campaign
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Set your fundraising goal, describe your story authentically. It
                takes just a few seconds to set up your personalized campaign.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="bg-[#bb4d00] bg-opacity-10 text-[#bb4d00] p-5 rounded-full mb-6">
                <Share2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-muted-foreground mb-3">
                2. Share with Community
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Share your campaign across social media to build momentum, reach
                potential supporters, and amplify your message.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="bg-[#bb4d00] bg-opacity-10 text-[#bb4d00] p-5 rounded-full mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-muted-foreground mb-3">
                3. Receive Support
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Accept electronic donations securely. Withdraw accumulated funds
                easily whenever they are needed.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" asChild>
              <Link to="/login">Start Your Campaign Now</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HowItWorks;
