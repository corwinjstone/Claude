import { Header } from "@/components/Header";
import { Bell } from "lucide-react";

const items = [
  { id: 1, title: "Randy accepted your Trailblazers bet", time: "2h ago" },
  { id: 2, title: "Fable 5 settled the Trailblazers bet — you won $16", time: "5m ago" },
];

export default function NotificationsPage() {
  return (
    <main className="max-w-md md:max-w-2xl mx-auto pb-12">
      <Header showBack />
      <h1 className="px-6 mt-2 text-3xl font-semibold">Notifications</h1>
      <ul className="mt-4 px-4 flex flex-col gap-3">
        {items.map((n) => (
          <li key={n.id} className="card p-4 flex gap-3 items-start">
            <Bell className="w-5 h-5 mt-0.5 text-accent" />
            <div>
              <div className="font-medium">{n.title}</div>
              <div className="text-white/55 text-xs mt-0.5">{n.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
