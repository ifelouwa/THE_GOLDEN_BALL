import { getProducts } from "../actions/product";
import { ProductList } from "../../components/ProductList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ProductsPage() {
  const { products, error } = await getProducts();
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="font-serif text-4xl font-bold tracking-tight">Active Auctions</h1>
          <p className="text-[var(--muted-foreground)]">
            Explore exclusive items and place your bids in real-time.
          </p>
        </div>
        
        {session && (
          <Link
            href="/products/create"
            className="flex items-center gap-2 rounded-md bg-[var(--foreground)] px-6 py-3 text-sm font-medium text-[var(--background)] transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create Auction
          </Link>
        )}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-500">
          {error}
        </div>
      ) : products?.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-20 text-center">
          <p className="text-lg font-medium text-[var(--muted-foreground)]">No active auctions at the moment.</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">Check back later or create your own!</p>
        </div>
      ) : (
        <ProductList initialProducts={products} user={session?.user} />
      )}
    </div>
  );
}
