import { Header } from "@/components/Header";
import { currentUser } from "@/lib/store";

export default function ProfilePage() {
  const me = currentUser();
  return (
    <main className="max-w-md md:max-w-2xl mx-auto pb-12">
      <Header showBack />
      <section className="px-6 mt-3 text-center">
        <img src={me.avatarUrl} alt={me.name} className="avatar w-24 h-24 mx-auto" />
        <div className="mt-3 text-2xl font-semibold">{me.name}</div>
        <div className="text-white/65">{me.handle}</div>
      </section>
      <section className="px-4 mt-6 card p-5">
        <div className="text-sm text-white/70 text-center">Built for friends-first wagers. Fable 5 helps you set fair odds, generate fun ideas, and judge outcomes when you can't agree.</div>
      </section>
    </main>
  );
}
