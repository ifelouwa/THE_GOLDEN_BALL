"use client";

import { motion } from "framer-motion";

export function Button({ children, onClick, type = "button", variant = "primary", className = "", disabled = false }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 active:scale-[0.98]",
    secondary: "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] active:scale-[0.98]",
    outline: "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] active:scale-[0.98]",
    ghost: "text-[var(--foreground)] hover:bg-[var(--muted)] active:scale-[0.98]",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
