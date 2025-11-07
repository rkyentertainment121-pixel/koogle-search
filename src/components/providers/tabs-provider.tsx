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
  updateTabTitle: (url: string, title: string) => void;
}

export const TabsContext = createContext<TabsContextType>({
  tabs: [],
  activeTab: null,
  addTab: () => {},
  closeTab: () => {},
  setActiveTab: () => {},
  updateTabTitle: () => {},
});

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize with a single "New Tab"
    if (tabs.length === 0) {
      const homeTabId = `tab-${Date.now()}`;
      setTabs([{ id: homeTabId, url: 'koogle:newtab', title: 'New Tab' }]);
      setActiveTabId(homeTabId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab) {
      if (activeTab.url === 'koogle:newtab') {
        router.push('/');
      } else if (activeTab.url.startsWith('koogle:search')) {
        const query = activeTab.url.split('?q=')[1] || '';
        router.push(`/search?q=${query}`);
      } else {
        router.push(`/search/view?url=${encodeURIComponent(activeTab.url)}`);
      }
    } else if (tabs.length > 0) {
      // If active tab is closed, set the last tab as active
      setActiveTab(tabs[tabs.length - 1].id);
    } else {
        // If all tabs are closed, create a new home tab
        addTab('koogle:newtab');
    }
  }, [activeTabId]);

  const addTab = (url: string, title?: string) => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      url: url,
      title: title || (url === 'koogle:newtab' ? 'New Tab' : url),
    };
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId);
      if (activeTabId === tabId) {
        if (newTabs.length > 0) {
          setActiveTabId(newTabs[newTabs.length - 1].id);
        } else {
          setActiveTabId(null);
        }
      }
      return newTabs;
    });
  };

  const setActiveTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const updateTabTitle = (url: string, title: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.url === url ? { ...tab, title: title || 'Untitled' } : tab
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
