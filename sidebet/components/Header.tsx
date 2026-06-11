"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Menu, UserCircle2 } from "lucide-react";
import { Logo } from "./Logo";

export function Header({
  showBack,
  walletAmount,
  notifications = 2,
}: {
  showBack?: boolean;
  walletAmount?: number;
  notifications?: number;
}) {
  const router = useRouter();
  return (
    <header className="relative pt-5 px-5 pb-3 flex items-center justify-between">
      <div className="w-12 flex items-center gap-2">
        {showBack ? (
          <button onClick={() => router.back()} aria-label="Back" className="p-1 -ml-1">
            <ChevronLeft className="w-7 h-7 text-white" strokeWidth={2.25} />
          </button>
        ) : (
          <Link href="/menu" aria-label="Menu" className="p-1 -ml-1">
            <Menu className="w-7 h-7 text-white" strokeWidth={2.25} />
          </Link>
        )}
        {walletAmount !== undefined && (
          <span className="text-white/90 text-base font-medium">
            ${walletAmount.toFixed(2)}
          </span>
        )}
      </div>

      <Link href="/" className="flex flex-col items-center text-white">
        <Logo size={32} />
        <div className="text-2xl font-semibold mt-1 tracking-tight">Sidebet</div>
      </Link>

      <div className="w-12 flex items-center gap-2 justify-end">
        <Link href="/profile" aria-label="Profile">
          <UserCircle2 className="w-7 h-7 text-white" strokeWidth={1.75} />
        </Link>
        <Link
          href="/notifications"
          className="relative w-7 h-7 rounded-full bg-cta border-2 border-white/70 flex items-center justify-center text-sm font-bold"
          aria-label="Notifications"
        >
          {notifications}
        </Link>
      </div>
    </header>
  );
}
