'use client';

import React, { useContext } from 'react';
import { TabsContext } from '@/components/providers/tabs-provider';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TabsBar() {
  const { tabs, activeTab, setActiveTab, closeTab, addTab } = useContext(TabsContext);

  const handleAddNewTab = () => {
    addTab('koogle:newtab');
  };

  return (
    <div className="flex items-center bg-muted/50 border-b border-border h-10 px-2">
      <div className="flex items-center gap-1 overflow-x-auto h-full py-1">
        {tabs.map(tab => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "h-full px-3 py-1 flex items-center gap-2 rounded-md transition-colors duration-150",
              activeTab?.id === tab.id
                ? 'bg-background shadow-sm'
                : 'hover:bg-background/50'
            )}
            style={{flexShrink: 0}}
          >
            <span className="truncate text-sm max-w-xs">{tab.title}</span>
            <X
              className="h-4 w-4 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            />
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 ml-2"
        onClick={handleAddNewTab}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">New Tab</span>
      </Button>
    </div>
  );
}
