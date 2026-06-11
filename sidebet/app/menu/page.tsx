import Link from "next/link";
import { Header } from "@/components/Header";

const items = [
  { href: "/", label: "Home" },
  { href: "/bet/new", label: "Make a bet" },
  { href: "/discover", label: "Find a Sidebet" },
  { href: "/wallet", label: "Wallet" },
  { href: "/profile", label: "Profile" },
  { href: "/notifications", label: "Notifications" },
  { href: "/splash", label: "Splash screen" },
];

export default function Menu() {
  return (
    <main className="max-w-md md:max-w-2xl mx-auto pb-12">
      <Header showBack />
      <h1 className="px-6 mt-2 text-3xl font-semibold">Menu</h1>
      <ul className="mt-4 px-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="block px-4 py-4 rounded-xl text-lg hover:bg-white/5 border-b border-white/5">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
