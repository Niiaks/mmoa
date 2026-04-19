import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

function TermsOfService() {
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
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-muted-foreground mb-2 text-center">
              Terms of Service
            </h2>

            <p className="text-center text-slate-500 mb-12">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <div className="space-y-10 text-slate-600 leading-relaxed">
              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By accessing and using mmoa, you agree to be bound by these
                  Terms of Service. If you do not agree to these terms, please
                  do not use our platform.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  2. User Accounts
                </h3>
                <p>
                  To create a campaign you may be required to register for an
                  account. You are responsible for maintaining the
                  confidentiality of your account information and for all
                  activities that occur under your account.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  3. Campaigns & Donations
                </h3>
                <p>
                  mmoa provides a platform for individuals to raise funds for
                  various causes. We do not guarantee the success of any
                  campaign, nor do we endorse the claims made by campaign
                  organizers. All donations are made voluntarily and risk is
                  assumed by the donor.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  4. Fees and Transactions
                </h3>
                <p>
                  Setting up a campaign is free. However, a standard platform
                  fee will be deducted from each withdrawal and third-party
                  payment processing fees may be deducted from each donation.
                  These fees will be clearly communicated prior to finalizing
                  any transaction.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  5. Prohibited Conduct
                </h3>
                <p>
                  You agree not to use the platform for any unlawful purpose,
                  including fraud, or money laundering. We reserve the right to
                  suspend or terminate accounts that violate our policies.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  6. Changes to Terms
                </h3>
                <p>
                  We may update these terms periodically. Your continued use of
                  the platform following the posting of any changes constitutes
                  your acceptance of the revised terms. Please check this page
                  regularly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-10 text-sm text-slate-500">
          If you have any questions about these Terms, please contact us at{" "}
          <address>
            <a
              href="mailto:juniorpappoe@gmail.com"
              className="text-[#bb4d00] hover:underline"
            >
              juniorpappoe@gmail.com
            </a>
          </address>
        </div>
      </main>
    </div>
  );
}

export default TermsOfService;
