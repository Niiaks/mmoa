import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useRouteError,
} from "react-router";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";

import App from "./App.jsx";
import Register from "./pages/auth/register.jsx";
import Login from "./pages/auth/login.jsx";
import Dashboard from "./pages/home/dashboard.jsx";
import CampaignDetail from "./pages/home/detail.jsx";
import Contribute from "./pages/home/contribute";
import Verify from "./pages/home/verify";
import NotFound from "./pages/error/error";
import ProtectedRoute from "./components/protectedRoute";
import Loader from "./components/Loader";
import HowItWorks from "./pages/mmoa/How";
import PrivacyPolicy from "./pages/mmoa/Privacy";
import TermsOfService from "./pages/mmoa/Terms";
import Withdraw from "./pages/home/withdraw";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./pages/error/fallback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function RouteErrorElement() {
  const error = useRouteError();
  return <ErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
}

function HomeRouter() {
  const { isLoading } = useAuth();

  if (isLoading) return <Loader />;

  return <Outlet />;
}

function HomeRedirect() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <App />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRouter />,
    errorElement: <RouteErrorElement />,
    children: [
      { index: true, element: <HomeRedirect /> },

      { path: "campaign/:id/details", element: <CampaignDetail /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },

      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: "withdraw/:id",
        element: (
          <ProtectedRoute>
            <Withdraw />
          </ProtectedRoute>
        ),
      },

      { path: "contribute/:slug", element: <Contribute /> },
      { path: "verify", element: <Verify /> },
      { path: "how-it-works", element: <HowItWorks /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms-of-service", element: <TermsOfService /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
