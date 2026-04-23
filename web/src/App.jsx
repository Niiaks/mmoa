import { Link, useNavigate } from "react-router";
import { Button } from "./components/ui/button";

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* The auto margins and max-width acts to center everything with wide sidebars */}
      <main className="container mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 w-full pt-8 pb-16">
        <header className="flex flex-row items-center justify-between py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-muted-foreground">
            mm<span className="text-[#bb4d00]">oa</span>
          </h1>
          <Button asChild variant="default">
            <Link to="/login">Sign in</Link>
          </Button>
        </header>

        <section className="mt-10 flex flex-col items-center justify-center text-center">
          <h2 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
            When life hits hard, <br />
            your community
            <br />
            <span className="text-[#bb4d00]">shows up</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            mmoa is a community-driven platform that helps you support each
            other through life's ups and downs. Create a campaign for a bereaved
            family, medical emergency, or any urgent need.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/login")} size="lg">
              Start a Campaign
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/how-it-works">See How it Works</Link>
            </Button>
          </div>
        </section>

        <section className="mt-10 flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#bb4d00] shadow-sm w-70 rounded-2xl flex flex-col p-6 justify-center gap-1">
              <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                GH₵ 100,000
              </h3>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">
                Total Raised
              </p>
            </div>
            <div className="border-[#bb4d00] border shadow-sm w-70 rounded-2xl flex flex-col p-6 justify-center gap-1">
              <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                3,000
              </h3>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">
                Beneficiaries
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-20 border-t border-slate-200 py-8 flex flex-col items-center gap-4 text-center">
          <div className="flex flex-row items-center gap-6 text-sm">
            <Link to="/terms-of-service">Terms of Service</Link>
            <span className="text-slate-300">|</span>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
          <p className="text-sm text-slate-400">
            © 2026 mmoa. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
