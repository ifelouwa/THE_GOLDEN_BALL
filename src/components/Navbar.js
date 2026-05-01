"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User, Gavel, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Gavel className="h-6 w-6 text-[var(--accent)]" />
          <span className="font-serif text-xl font-semibold tracking-tight">The Golden Ball</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            Auctions
          </Link>

          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:opacity-80 transition-opacity"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}
          
          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <User className="h-4 w-4" />
                <span>{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 rounded-md bg-[var(--muted)] px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--border)]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="rounded-md bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)] transition-transform hover:scale-105 active:scale-95">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
