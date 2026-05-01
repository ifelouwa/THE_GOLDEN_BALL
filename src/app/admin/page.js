import { getAdminStats } from "../actions/admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { AdminClient } from "./AdminClient";
import { Users, Package, Gavel, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Admin Panel | The Golden Ball",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { stats, products, users, error } = await getAdminStats();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-7xl">
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="rounded-full bg-[var(--accent)]/10 p-3">
          <ShieldCheck className="h-7 w-7 text-[var(--accent)]" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold">Admin Panel</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Manage auctions, users, and platform activity
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { icon: Users, label: "Total Users", value: stats.userCount, color: "blue" },
          { icon: Package, label: "Total Auctions", value: stats.productCount, color: "purple" },
          { icon: Gavel, label: "Total Bids", value: stats.bidCount, color: "yellow" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-6 space-y-3"
          >
            <div
              className={`inline-flex rounded-full p-2 ${
                color === "yellow"
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : color === "blue"
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-purple-500/10 text-purple-400"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              {label}
            </p>
            <p className="font-serif text-4xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Interactive Tables */}
      <AdminClient products={products} users={users} />
    </div>
  );
}
