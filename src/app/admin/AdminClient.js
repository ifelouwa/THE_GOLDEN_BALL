"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toggleProductStatus, deleteProduct, promoteToAdmin, deleteUser } from "../actions/admin";
import { Trash2, ToggleLeft, ToggleRight, ShieldPlus, Package, Users } from "lucide-react";

export function AdminClient({ products, users }) {
  const [activeTab, setActiveTab] = useState("products");
  const [loadingId, setLoadingId] = useState(null);

  const handleToggleStatus = async (productId, currentStatus) => {
    setLoadingId(productId);
    await toggleProductStatus(productId, currentStatus);
    setLoadingId(null);
  };

  const handleDelete = async (productId) => {
    if (!confirm("Delete this auction and all its bids? This cannot be undone.")) return;
    setLoadingId(productId + "-del");
    await deleteProduct(productId);
    setLoadingId(null);
  };

  const handlePromote = async (userId) => {
    if (!confirm("Promote this user to Admin?")) return;
    setLoadingId(userId + "-promote");
    await promoteToAdmin(userId);
    setLoadingId(null);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure? This will permanently delete the user, their auctions, and all their bids!")) return;
    setLoadingId(userId + "-deluser");
    await deleteUser(userId);
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-1 w-fit">
        {[
          { id: "products", icon: Package, label: "Auctions" },
          { id: "users", icon: Users, label: "Users" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Products Table */}
      {activeTab === "products" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl border border-[var(--border)]"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Item</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Seller</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Bids</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/10 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-10 w-10 rounded-lg object-cover border border-[var(--border)]"
                      />
                      <div>
                        <p className="font-medium text-sm leading-tight">{p.title}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          ${p.currentPrice || p.startingPrice}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    {p.seller.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{p._count.bids}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        p.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.status)}
                        disabled={loadingId === p.id}
                        title={p.status === "ACTIVE" ? "Close auction" : "Reopen auction"}
                        className="rounded-md p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-40"
                      >
                        {p.status === "ACTIVE" ? (
                          <ToggleRight className="h-4 w-4 text-green-400" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={loadingId === p.id + "-del"}
                        title="Delete auction"
                        className="rounded-md p-1.5 text-[var(--muted-foreground)] hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-12 text-center text-[var(--muted-foreground)]">No auctions yet.</div>
          )}
        </motion.div>
      )}

      {/* Users Table */}
      {activeTab === "users" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl border border-[var(--border)]"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">User</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Role</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Bids</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/10 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">@{u.username}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        u.role === "ADMIN"
                          ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{u.bidCount}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {u.role !== "ADMIN" && (
                        <button
                          onClick={() => handlePromote(u.id)}
                          disabled={loadingId === u.id + "-promote"}
                          title="Promote to Admin"
                          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors disabled:opacity-40"
                        >
                          <ShieldPlus className="h-3.5 w-3.5" />
                          Make Admin
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={loadingId === u.id + "-deluser"}
                        title="Delete user and all data"
                        className="rounded-md p-1.5 text-[var(--muted-foreground)] hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-12 text-center text-[var(--muted-foreground)]">No users yet.</div>
          )}
        </motion.div>
      )}
    </div>
  );
}
