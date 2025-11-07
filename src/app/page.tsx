import Header from "@/components/koogle/header";
import PrivacyStats from "@/components/koogle/privacy-stats";
import SearchBar from "@/components/koogle/search-bar";
import ShortcutGrid from "@/components/koogle/shortcut-grid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl flex flex-col items-center gap-8">
          <h1 className="text-5xl md:text-7xl font-bold font-headline text-center tracking-tighter">
            Koogle Search
          </h1>
          <SearchBar />
          <ShortcutGrid />
        </div>
      </main>
      <PrivacyStats />
    </div>
  );
}
