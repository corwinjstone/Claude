import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function SplashPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <Logo size={88} className="text-white" />
        <h1 className="mt-6 text-6xl font-semibold tracking-tight">Sidebet</h1>
        <p className="mt-6 text-2xl text-white/80">Wanna bet?!</p>

        <Link
          href="/"
          className="mt-12 inline-block px-8 py-3 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 transition"
        >
          Enter
        </Link>
      </div>

      <footer className="absolute bottom-6 inset-x-0 text-center text-white/55 text-xs">
        © 2026 Sidebet — Friend-to-friend wagers, judged by Fable 5
      </footer>
    </main>
  );
}
