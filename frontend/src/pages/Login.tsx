import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBanner from "../components/ErrorBanner";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const loading = useAuthStore((state) => state.loading);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, firstName, lastName);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="flex items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-lg">
          <Card className="border border-border">
            <CardContent className="px-7 py-9">
            <div className="mb-6">
              <span className="mb-4 inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
                Secure access
              </span>
              <h2 className="text-2xl font-semibold">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Sign in to track reports, status updates, and summaries in real time.
              </p>
            </div>
            <ErrorBanner message={error} />
            <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
              {mode === "register" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      placeholder="Jane"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@hospital.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                />
              </div>
              <Button className="mt-1" type="submit" disabled={loading}>
                {loading ? "Please wait" : mode === "login" ? "Login" : "Register"}
              </Button>
            </form>
            <Button
              type="button"
              variant="link"
              className="mt-5 p-0"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Need an account? Register" : "Have an account? Login"}
            </Button>
            </CardContent>
          </Card>
        </div>
      </section>
      <aside className="hidden items-center justify-center bg-slate-900 px-10 py-16 text-white lg:flex">
        <div className="max-w-sm space-y-6">
          <h3 className="text-3xl font-semibold">Operational clarity for every report.</h3>
          <p className="text-sm text-slate-200">
            Centralize uploads, monitor processing, and deliver polished summaries with confidence.
          </p>
          <div className="grid gap-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3">
              Status pipeline visibility at a glance.
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3">
              Secure storage with metadata and timestamps.
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3">
              Summary workflows ready for automation.
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
