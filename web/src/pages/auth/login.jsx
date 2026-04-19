import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/auth/useLogin";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: loginUser, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();

    loginUser({ email, password });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 w-full pt-8 pb-16">
        <header className="flex items-center justify-between py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-muted-foreground">
            mm<span className="text-[#bb4d00]">oa</span>
          </h1>

          <Link
            to="/"
            className="text-slate-500 hover:text-slate-800 flex items-center gap-2"
          >
            <ArrowLeft />
            Back
          </Link>
        </header>

        <section className="mt-10 flex justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your details below to login
              </CardDescription>

              <CardAction>
                <Button variant="link" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default Login;
