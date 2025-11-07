import Header from "@/components/koogle/header";
import PrivacyStats from "@/components/koogle/privacy-stats";
import SearchBar from "@/components/koogle/search-bar";
import ShortcutGrid from "@/components/koogle/shortcut-grid";
import TabsBar from "@/components/koogle/tabs-bar";
import ViewPage from "./search/view/page";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <TabsBar />
      <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <ViewPage isHomePage={true} />
        </Suspense>
      </div>
    </div>
  );
}
