"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { placeBid } from "../app/actions/product";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

const POLL_INTERVAL = 30_000; // 30 seconds

export function ProductList({ initialProducts, user }) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const router = useRouter();

  // Gap #1: 30-second polling — re-fetches server data to show live prices
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
      setLastRefreshed(new Date());
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [router]);

  // Sync incoming server data into local state
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleBidClick = (product) => {
    setSelectedProduct(product);
    setBidAmount((product.currentPrice || product.startingPrice) + 10);
    setError("");
  };

  const handlePlaceBid = async () => {
    if (!user) {
      setError("Please sign in to place a bid");
      return;
    }

    setLoading(true);
    setError("");

    const res = await placeBid(selectedProduct.id, parseFloat(bidAmount));

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSelectedProduct(null);
      setLoading(false);
      // In a real app with WebSockets or Polling, the list would update automatically.
      // Here we rely on revalidatePath which refreshes the server component,
      // but for immediate local feedback we could update state.
    }
  };

  return (
    <div className="space-y-8">
      {/* Live update indicator */}
      <div className="flex items-center justify-end gap-2 text-xs text-[var(--muted-foreground)]">
        <RefreshCw className="h-3 w-3 animate-spin-slow" />
        <span>Live · updates every 30s · last at {lastRefreshed.toLocaleTimeString()}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="block group/card">
            <ProductCard
              product={product}
              user={user}
              onBid={() => handleBidClick(product)}
            />
          </Link>
        ))}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
                <h2 className="font-serif text-lg font-bold">Place a Bid</h2>
                <button onClick={() => setSelectedProduct(null)} className="rounded-full p-1 hover:bg-[var(--muted)]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-[var(--muted-foreground)]">Current Price</p>
                  <p className="font-serif text-3xl font-bold text-[var(--accent)]">
                    ${selectedProduct.currentPrice || selectedProduct.startingPrice}
                  </p>
                </div>

                {error && (
                  <div className="rounded-md bg-red-500/10 p-3 text-xs text-red-500 text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <Input
                    label="Your Bid Amount ($)"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                  <Button
                    className="w-full"
                    onClick={handlePlaceBid}
                    disabled={loading}
                  >
                    {loading ? "Placing Bid..." : `Place $${bidAmount} Bid`}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
