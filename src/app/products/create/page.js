"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Package, AlertCircle, ImageIcon } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { createProduct } from "../../actions/product";

export default function CreateProductPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Gap #5: Basic URL validation
    if (imageUrl && !imageUrl.startsWith("http")) {
      setError("Image URL must start with http:// or https://");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.target);
    const res = await createProduct(formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/products");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 rounded-xl border border-[var(--border)] bg-[var(--background)] p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center space-y-2 text-center sm:items-start sm:text-left">
          <div className="rounded-full bg-[var(--muted)] p-3">
            <Package className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Create Auction</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            List your item for auction and watch the bids roll in.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Item Title"
            name="title"
            placeholder="e.g. Rare Vintage Watch"
            required
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Tell us about the item's history and condition..."
              className="block w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Starting Price ($)"
              name="startingPrice"
              type="number"
              placeholder="0.00"
              required
            />

            {/* Gap #5: Image URL with live preview */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Image URL
              </label>
              <input
                name="image"
                type="url"
                value={imageUrl}
                onChange={(e) => { setImageUrl(e.target.value); setImageError(false); }}
                placeholder="https://example.com/image.jpg"
                required
                className="block w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--foreground)] focus:outline-none"
              />
            </div>
          </div>

          {/* Gap #5: Image preview */}
          <AnimatePresence>
            {imageUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-xl border border-[var(--border)]"
              >
                {imageError ? (
                  <div className="flex flex-col items-center justify-center gap-2 bg-[var(--muted)]/30 p-8 text-[var(--muted-foreground)]">
                    <ImageIcon className="h-8 w-8" />
                    <p className="text-sm">Could not load image preview</p>
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    onError={() => setImageError(true)}
                    className="aspect-[16/7] w-full object-cover"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Auction End Date & Time"
            name="endTime"
            type="datetime-local"
            required
          />

          <div className="flex items-center gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Creating..." : "Launch Auction"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
