import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

function PrivacyPolicy() {
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
        <div className="p-8 md:p-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-muted-foreground mb-2 text-center">
              Privacy Policy
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
                  1. Information We Collect
                </h3>
                <p>
                  We collect information you provide directly to us, such as
                  your name, email address, phone number, and payment
                  information when you create an account, start a campaign, or
                  make a donation.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  2. How We Use Your Information
                </h3>
                <p>
                  We use the information we collect to operate, maintain, and
                  improve our platform. This includes processing transactions,
                  sending account updates, verifying identities to prevent
                  fraud, and providing prompt customer support.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  3. Information Sharing
                </h3>
                <p>
                  We do not sell your personal information. We may share your
                  information with trusted third-party service providers who
                  assist us in operating our platform, conducting our business,
                  processing secure payments, or serving our users.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  4. Data Security
                </h3>
                <p>
                  We implement reasonable security measures, including modern
                  encryption standards, to protect your personal information
                  from unauthorized access, alteration, or disclosure. However,
                  no method of transmission over the Internet or electronic
                  storage is 100% secure.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  5. Your Rights
                </h3>
                <p>
                  Depending on your location, you may have the right to request
                  access to, correction of, or deletion of your personal data.
                  You are always in control of your data and can contact our
                  privacy or support team to exercise these rights at any time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-10 text-sm text-slate-500">
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
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

export default PrivacyPolicy;
