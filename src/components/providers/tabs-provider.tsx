
'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Tab } from '@/lib/types';

interface TabsContextType {
  tabs: Tab[];
  activeTab: Tab | null;
  addTab: (url: string, title?: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabTitle: (tabId: string, title: string) => void;
}

export const TabsContext = createContext<TabsContextType>({
  tabs: [],
  activeTab: null,
  addTab: () => {},
  closeTab: () => {},
  setActiveTab: () => {},
  updateTabTitle: () => {},
});

const createUniqueId = () => `tab-${Date.now()}-${Math.random()}`;

const createNewTab = (): Tab => ({
  id: createUniqueId(),
  url: 'koogle:newtab',
  title: 'New Tab',
});

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize with a single "New Tab"
    if (tabs.length === 0) {
      const homeTab = createNewTab();
      setTabs([homeTab]);
      setActiveTabId(homeTab.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab) {
      const params = new URLSearchParams();
      if (activeTab.url) {
        params.set('url', activeTab.url);
      }
      // We push a unique ID to the history state to ensure navigation
      // occurs even if the URL is the same.
      router.push(`/search/view?${params.toString()}&v=${Date.now()}`);
    } else if (tabs.length > 0) {
      setActiveTabId(tabs[tabs.length - 1].id);
    } else {
        addTab('koogle:newtab');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);


  const addTab = (url: string, title?: string) => {
    const newTab: Tab = {
      id: createUniqueId(),
      url: url,
      title: title || (url === 'koogle:newtab' ? 'New Tab' : (url.startsWith('koogle:search') ? url.split('?q=')[1] : url)),
    };
    
    // If the currently active tab is a new tab, replace it instead of adding another one.
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab && activeTab.url === 'koogle:newtab') {
      setTabs(prevTabs => prevTabs.map(t => t.id === activeTabId ? newTab : t));
    } else {
      setTabs(prevTabs => [...prevTabs, newTab]);
    }
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    setTabs(prevTabs => {
      const tabIndex = prevTabs.findIndex(tab => tab.id === tabId);
      if (tabIndex === -1) return prevTabs;

      const newTabs = prevTabs.filter(tab => tab.id !== tabId);

      if (activeTabId === tabId) {
        if (newTabs.length > 0) {
          const newActiveIndex = Math.max(0, tabIndex - 1);
          setActiveTabId(newTabs[newActiveIndex].id);
        } else {
          setActiveTabId(null);
        }
      }
      
      if (newTabs.length === 0) {
        // The useEffect for activeTabId will handle creating a new tab
        return [];
      }

      return newTabs;
    });
  };

  const setActiveTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const updateTabTitle = (tabId: string, title: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? { ...tab, title: title || 'Untitled' } : tab
      )
    );
  };
  
  const activeTab = tabs.find(t => t.id === activeTabId) || null;

  const value = {
    tabs,
    activeTab,
    addTab,
    closeTab,
    setActiveTab,
    updateTabTitle
  };

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};
