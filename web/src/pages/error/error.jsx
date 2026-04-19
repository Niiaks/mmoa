import { AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-5">
      <main className="container mx-auto max-w-5xl px-6 sm:px-12 w-full pt-8 pb-16">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-muted-foreground">
            mm<span className="text-[#bb4d00]">oa</span>
          </h1>
        </header>

        {/* 404 State */}
        <section className="mt-10 flex justify-center">
          <div className="w-full max-w-sm">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <AlertCircle className="text-red-600" />
                </EmptyMedia>

                <EmptyTitle className="text-xl">404 Page Not Found</EmptyTitle>

                <EmptyDescription>
                  The page you&apos;re looking for does not exist.
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent className="flex-col gap-3 w-full">
                <Button asChild>
                  <Link to="/">Return Home</Link>
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        </section>
      </main>
    </div>
  );
}

export default NotFound;
