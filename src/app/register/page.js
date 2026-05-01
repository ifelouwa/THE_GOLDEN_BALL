"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { register } from "../actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const res = await register(formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-xl border border-[var(--border)] bg-[var(--background)] p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-[var(--muted)] p-3">
            <UserPlus className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Join The Golden Ball to start bidding on exclusive items
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-md bg-red-500/10 p-3 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            label="Full Name"
            name="name"
            placeholder="John Doe"
            required
          />
          <Input
            label="Username"
            name="username"
            placeholder="johndoe"
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@example.com"
            className="sm:col-span-2"
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            placeholder="+1 234 567 890"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            className="sm:col-span-2"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="text-center text-sm text-[var(--muted-foreground)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--foreground)] hover:underline"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
