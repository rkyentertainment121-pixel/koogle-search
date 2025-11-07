import Header from "@/components/koogle/header";
import TabsBar from "@/components/koogle/tabs-bar";
import ViewPage from "./search/view/page";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <TabsBar />
      <div className="flex-1 overflow-y-auto bg-background">
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <ViewPage />
        </Suspense>
      </div>
    </div>
  );
}
