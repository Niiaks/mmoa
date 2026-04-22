import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRouter />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/withdraw/:id",
    element: (
      <ProtectedRoute>
        <Withdraw />
      </ProtectedRoute>
    ),
  },
  {
    path: "/campaign/:id/details",
    element: (
      <ProtectedRoute>
        <CampaignDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/contribute/:slug",
    element: <Contribute />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function HomeRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return user ? <Dashboard /> : <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
