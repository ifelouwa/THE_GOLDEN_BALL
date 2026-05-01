"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gavel, ShieldCheck, Trophy } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-32 text-center">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 -left-1/4 h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container relative z-10 mx-auto max-w-4xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-1.5 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Live Auction House
            </span>
          </div>

          <h1 className="font-serif text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-7xl">
            Where Rarity Meets <br />
            <span className="bg-gradient-to-r from-[var(--foreground)] to-[var(--accent)] bg-clip-text text-transparent italic">
              Legacy.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-[var(--muted-foreground)] sm:text-xl">
            Experience the thrill of high-stakes bidding. Discover a curated selection of 
            world-class items, from timeless watches to contemporary masterpieces.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/products">
              <Button className="h-14 px-8 text-base shadow-lg shadow-[var(--accent)]/20">
                Browse Auctions <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="h-14 px-8 text-base backdrop-blur-md">
                Join the House
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats / Features Grid */}
        <div className="container mx-auto mt-32 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { icon: Gavel, title: "Expert Vetting", desc: "Every item is verified by our specialists." },
              { icon: ShieldCheck, title: "Secure Bidding", desc: "Bank-grade security for every transaction." },
              { icon: Trophy, title: "Exclusive Access", desc: "Items you won't find anywhere else." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex flex-col items-center space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 p-8 backdrop-blur-sm"
              >
                <div className="rounded-full bg-[var(--accent)]/10 p-3 text-[var(--accent)]">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-[var(--border)] bg-[var(--muted)]/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-10">
            Trusted by Collectors Worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale transition-all hover:grayscale-0">
            {/* Logos could go here */}
            <span className="font-serif text-2xl font-bold italic">Sotheby&apos;s</span>
            <span className="font-serif text-2xl font-bold italic">Christie&apos;s</span>
            <span className="font-serif text-2xl font-bold italic">Phillips</span>
            <span className="font-serif text-2xl font-bold italic">Bonhams</span>
          </div>
        </div>
      </section>
    </div>
  );
}
