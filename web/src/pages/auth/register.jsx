import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/auth/useRegister";
import { useLogin } from "@/hooks/auth/useLogin";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { mutate: registerUser, isPending } = useRegister();
  const { mutate: loginUser } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(
      { email, password, name, phone },
      {
        onSuccess: () => {
          loginUser({ email, password });
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* The auto margins and max-width acts to center everything with wide sidebars */}
      <main className="container mx-auto max-w-6xl px-6 sm:px-12 lg:px-24 w-full pt-8 pb-16">
        <header className="flex flex-row items-center justify-between py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-muted-foreground">
            mm<span className="text-[#bb4d00]">oa</span>
          </h1>
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-800 transition-colors flex flex-row items-center gap-2"
          >
            <ArrowLeft />
            Back
          </Link>
        </header>
        <section className="mt-10 flex flex-col items-center justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Enter your details below to create an account
              </CardDescription>
              <CardAction>
                <Button variant="link" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    id="phone"
                    type="tel"
                    placeholder="0201234567"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Creating account..." : "Register"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default Register;
