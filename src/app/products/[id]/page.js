import { getProductById } from "../../actions/product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductDetailClient } from "./ProductDetailClient";
import { ArrowLeft, User, Clock, Tag, Gavel, TrendingUp } from "lucide-react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { product } = await getProductById(id);
  if (!product) return { title: "Not Found" };
  return {
    title: `${product.title} | The Golden Ball`,
    description: product.description || `Bid on ${product.title} at The Golden Ball auction house.`,
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const { product, error } = await getProductById(id);
  const session = await getServerSession(authOptions);

  if (error || !product) notFound();

  const currentPrice = product.currentPrice || product.startingPrice;
  const isActive = product.status === "ACTIVE" && new Date() < new Date(product.endTime);
  const isOwner = session?.user?.id === product.sellerId;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-6xl">
      {/* Back Button */}
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Auctions
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left — Image */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] aspect-[4/3] relative">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                  isActive
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                }`}
              >
                {isActive ? "Live" : product.status}
              </span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10">
              <User className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Seller</p>
              <p className="font-medium">{product.seller.name}</p>
              <p className="text-xs text-[var(--muted-foreground)]">@{product.seller.username}</p>
            </div>
          </div>
        </div>

        {/* Right — Details & Bidding */}
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight">{product.title}</h1>
            {product.description && (
              <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Price Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                <Tag className="h-3 w-3" /> Starting Price
              </div>
              <p className="font-serif text-2xl font-bold">{product.currency || "$"}{product.startingPrice.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                <TrendingUp className="h-3 w-3" /> Current Bid
              </div>
              <p className="font-serif text-2xl font-bold text-[var(--accent)]">{product.currency || "$"}{currentPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Auction End Time */}
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
            <Clock className="h-5 w-5 text-[var(--muted-foreground)] shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                {isActive ? "Auction Ends" : "Auction Ended"}
              </p>
              <p className="font-medium">{new Date(product.endTime).toLocaleString()}</p>
            </div>
          </div>

          {/* Bid CTA — Client Interactive Component */}
          <ProductDetailClient
            product={product}
            user={session?.user}
            isOwner={isOwner}
            isActive={isActive}
            currentPrice={currentPrice}
          />
        </div>
      </div>

      {/* Bid History */}
      <div className="mt-16">
        <div className="mb-6 flex items-center gap-3">
          <Gavel className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="font-serif text-2xl font-bold">Bid History</h2>
          <span className="rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs font-bold text-[var(--muted-foreground)]">
            {product.bids.length} {product.bids.length === 1 ? "bid" : "bids"}
          </span>
        </div>

        {product.bids.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/20 p-12 text-center">
            <Gavel className="mx-auto mb-3 h-8 w-8 text-[var(--muted-foreground)]" />
            <p className="font-medium text-[var(--muted-foreground)]">No bids yet. Be the first!</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40">
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Bidder</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Time</th>
                </tr>
              </thead>
              <tbody>
                {product.bids.map((bid, i) => (
                  <tr
                    key={bid.id}
                    className={`border-b border-[var(--border)] transition-colors hover:bg-[var(--muted)]/20 ${i === 0 ? "bg-[var(--accent)]/5" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {i === 0 && (
                          <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--accent-foreground)]">
                            Top
                          </span>
                        )}
                        <span className="font-medium">{bid.bidder.name}</span>
                        <span className="text-xs text-[var(--muted-foreground)]">@{bid.bidder.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--accent)]">{product.currency || "$"}{bid.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">
                      {new Date(bid.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
