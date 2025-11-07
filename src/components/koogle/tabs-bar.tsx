'use client';

import React, { useContext } from 'react';
import { TabsContext } from '@/components/providers/tabs-provider';
import { Button } from '@/components/ui/button';
import { X, Plus, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TabsBar() {
  const { tabs, activeTab, setActiveTab, closeTab, addTab } = useContext(TabsContext);

  const handleAddNewTab = () => {
    addTab('koogle:newtab');
  };

  return (
    <div className="flex items-center border-b bg-muted/50 h-10 px-2">
      <div className="flex items-center gap-1 overflow-x-auto h-full py-1">
        {tabs.map(tab => {
          const isActive = activeTab?.id === tab.id;
          let domain = "New Tab";
           try {
              if (tab.url !== 'koogle:newtab' && !tab.url.startsWith('koogle:search')) {
                  domain = new URL(tab.url).hostname;
              }
          } catch (e) {
              // Keep default
          }

          const faviconUrl = (tab.url === 'koogle:newtab' || tab.url.startsWith('koogle:search'))
              ? null 
              : `https://www.google.com/s2/favicons?sz=16&domain_url=${domain}`;

          return (
            <Button
              key={tab.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                "h-full px-3 text-sm font-normal justify-start gap-2 max-w-60",
                { "bg-background shadow-sm": isActive }
              )}
              onClick={() => setActiveTab(tab.id)}
            >
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
              <span className="truncate">{tab.title}</span>
              <X
                className="h-4 w-4 text-muted-foreground hover:text-foreground rounded-full ml-auto flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              />
            </Button>
          )
        })}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 ml-1 rounded-full"
        onClick={handleAddNewTab}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">New Tab</span>
      </Button>
    </div>
  );
}
