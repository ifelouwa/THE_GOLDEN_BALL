"use client";

import { motion } from "framer-motion";
import { Clock, Tag, Gavel } from "lucide-react";
import { Button } from "./ui/Button";

export function ProductCard({ product, user, onBid }) {
  const currentPrice = product.currentPrice || product.startingPrice;
  const isOwner = user && user.id === product.sellerId;
  const isActive = product.status === "ACTIVE" && new Date() < new Date(product.endTime);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] transition-all hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            {product.status}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold leading-tight group-hover:text-[var(--accent)] transition-colors">
            {product.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
            {product.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-lg bg-[var(--muted)] p-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Starting
            </span>
            <div className="flex items-center gap-1 font-medium">
              <Tag className="h-3 w-3" />
              {product.currency || "$"}{product.startingPrice}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Current Bid
            </span>
            <div className="flex items-center gap-1 font-bold text-[var(--accent)]">
              <Gavel className="h-3 w-3" />
              {product.currency || "$"}{currentPrice}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
            <Clock className="h-3.5 w-3.5" />
            <span>Ends: {new Date(product.endTime).toLocaleDateString()}</span>
          </div>
          
          {!isOwner && isActive && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={(e) => { e.preventDefault(); onBid(product); }}
            >
              Bid Now
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
