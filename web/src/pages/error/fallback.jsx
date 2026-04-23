import { Button } from "@/components/ui/button";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong.</h1>

        <p className="text-lg text-gray-600 mb-6">{error.message}</p>
        <Button onClick={resetErrorBoundary} size="lg">
          Reload Page
        </Button>
      </div>
    </div>
  );
}

export default ErrorFallback;
