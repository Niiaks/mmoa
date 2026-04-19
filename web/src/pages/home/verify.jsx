import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "react-router";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useVerifyContribution } from "@/hooks/contribution/useVerify";
import Loader from "@/components/Loader";

function Verify() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  const { data: contributionData, isPending } =
    useVerifyContribution(reference);

  if (isPending) {
    return <Loader />;
  }

  const data = contributionData?.data || {};

  return (
    <div className="min-h-screen">
      <main className="container mx-auto max-w-5xl px-6 sm:px-12 w-full pt-8 pb-16">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-muted-foreground">
            mm<span className="text-[#bb4d00]">oa</span>
          </h1>
        </header>

        {/* Success State */}
        <section className="mt-10 flex justify-center">
          <div className="w-full max-w-sm">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CheckCircle2 className="text-green-600" />
                </EmptyMedia>

                <EmptyTitle className="text-xl">GH₵ {data.amount}</EmptyTitle>

                <EmptyDescription>
                  Your contribution was received for{" "}
                  <span className="text-black font-bold">{data.campaign}</span>.
                  A receipt has been sent to your email.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Verify;
