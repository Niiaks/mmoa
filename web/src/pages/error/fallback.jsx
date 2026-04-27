import { Button } from "@/components/ui/button";

function ErrorFallback({ error, resetErrorBoundary }) {
  const message =
    "An unexpected error occurred. Please reload the page to try again.";
  const debugMessage =
    import.meta.env.DEV && error instanceof Error ? error.message : null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong.</h1>

        <p className="text-lg text-gray-600 mb-6">{message}</p>
        {debugMessage ? (
          <p className="text-red-500 mb-4">{debugMessage}</p>
        ) : null}
        <Button onClick={resetErrorBoundary} size="lg">
          Reload Page
        </Button>
      </div>
    </div>
  );
}

export default ErrorFallback;
