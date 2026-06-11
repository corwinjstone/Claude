import { currentUser } from "@/lib/store";
import { Header } from "@/components/Header";
import { NewBetClient } from "./NewBetClient";

export default function NewBetPage() {
  const me = currentUser();
  return (
    <main className="max-w-md md:max-w-2xl mx-auto pb-28">
      <Header showBack walletAmount={me.walletUsd} />
      <NewBetClient />
    </main>
  );
}
