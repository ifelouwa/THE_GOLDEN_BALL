"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, X, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { placeBid } from "../../actions/product";

export function ProductDetailClient({ product, user, isOwner, isActive, currentPrice }) {
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState((currentPrice + 10).toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handlePlaceBid = async () => {
    if (!user) {
      setError("Please sign in to place a bid");
      return;
    }
    setLoading(true);
    setError("");

    const res = await placeBid(product.id, parseFloat(bidAmount));

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setShowBidModal(false);
        setSuccess(false);
        router.refresh();
      }, 1500);
    }
  };

  if (!isActive) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-5 text-center">
        <p className="font-medium text-[var(--muted-foreground)]">This auction has ended.</p>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-5 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">You are the seller of this item.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-5 text-center space-y-3">
        <p className="text-sm text-[var(--muted-foreground)]">Sign in to place a bid on this item.</p>
        <Button onClick={() => router.push("/login")} className="w-full">
          Sign In to Bid
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => { setShowBidModal(true); setError(""); }}
        className="w-full h-14 text-base shadow-lg shadow-[var(--accent)]/20"
      >
        <Gavel className="mr-2 h-5 w-5" />
        Place a Bid
      </Button>

      <AnimatePresence>
        {showBidModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
                <h2 className="font-serif text-lg font-bold">Place a Bid</h2>
                <button
                  onClick={() => setShowBidModal(false)}
                  className="rounded-full p-1 hover:bg-[var(--muted)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 py-4 text-center"
                  >
                    <CheckCircle className="h-12 w-12 text-green-400" />
                    <p className="font-semibold text-green-400">Bid placed successfully!</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-[var(--muted-foreground)]">Current Price</p>
                      <p className="font-serif text-3xl font-bold text-[var(--accent)]">
                        {product.currency || "$"}{currentPrice.toFixed(2)}
                      </p>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 rounded-md bg-red-500/10 p-3 text-xs text-red-500">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                      </div>
                    )}

                    <div className="space-y-4">
                      <Input
                        label={`Your Bid Amount (${product.currency || "$"})`}
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
                        {loading ? "Placing Bid..." : `Place ${product.currency || "$"}${bidAmount} Bid`}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
