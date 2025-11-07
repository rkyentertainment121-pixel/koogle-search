'use client';

import React, { useContext } from 'react';
import { TabsContext } from '@/components/providers/tabs-provider';
import { Button } from '@/components/ui/button';
import { X, Plus, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const TabShape = ({ className, fill }: { className?: string, fill: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 220 36"
    className={cn("absolute inset-0 w-full h-full", className)}
    fill={fill}
  >
    <defs>
      <clipPath id="tab-clip">
        <path d="M0,36 L220,36 L220,0 L0,0 Z" />
      </clipPath>
    </defs>
    <path
      clipPath="url(#tab-clip)"
      d="M10,0 H210 C215.523,0 220,4.47715 220,10 V36 H0 V10 C0,4.47715 4.47715,0 10,0 Z"
    />
  </svg>
);

const TabSeparator = ({ className }: { className?: string }) => (
    <div className={cn("h-4 w-px bg-border group-hover:bg-transparent", className)} />
)

export default function TabsBar() {
  const { tabs, activeTab, setActiveTab, closeTab, addTab } = useContext(TabsContext);

  const handleAddNewTab = () => {
    addTab('koogle:newtab');
  };

  return (
    <div className="tab-bar-background flex items-end border-b border-border h-10 px-2 pt-1.5">
      <div className="flex items-end gap-0 overflow-x-auto">
        {tabs.map((tab, index) => {
            const isActive = activeTab?.id === tab.id;
            let domain = "New Tab";
             try {
                if (tab.url !== 'koogle:newtab') {
                    domain = new URL(tab.url).hostname;
                }
            } catch (e) {
                // Keep default
            }

            const faviconUrl = tab.url === 'koogle:newtab' 
                ? null 
                : `https://www.google.com/s2/favicons?sz=16&domain_url=${domain}`;

            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "group relative flex items-center justify-between h-full px-3 py-1.5 rounded-t-lg cursor-pointer transition-colors duration-150 w-60",
                  "text-muted-foreground",
                  { "text-foreground": isActive }
                )}
                style={{ flexShrink: 0 }}
              >
                <TabShape fill={isActive ? "hsl(var(--background))" : "hsl(var(--muted))"} className="group-hover:fill-background/50 transition-colors duration-150" />
                <div className="relative z-10 flex items-center gap-2 w-full truncate">
                    {faviconUrl ? (
                         <img
                            src={faviconUrl}
                            alt={`${domain} favicon`}
                            width={16}
                            height={16}
                            className="rounded flex-shrink-0"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                    ) : <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />}

                    <span className="truncate text-sm">{tab.title}</span>
                </div>
                <X
                  className="relative z-10 h-4 w-4 text-muted-foreground rounded-full hover:bg-destructive/20 hover:text-foreground flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                />
                {!isActive && index < tabs.length && <TabSeparator className="absolute right-0 top-1/2 -translate-y-1/2 z-20" />}
              </div>
            )
        })}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 ml-1 mb-1.5 rounded-full"
        onClick={handleAddNewTab}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">New Tab</span>
      </Button>
    </div>
  );
}
