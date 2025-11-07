
'use client';

import React, { createContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Initialize with a single "New Tab" on first load
    if (isInitialMount.current && tabs.length === 0) {
      const homeTab = createNewTab();
      setTabs([homeTab]);
      setActiveTabId(homeTab.id);
    }
    isInitialMount.current = false;
  }, [tabs.length]);


  useEffect(() => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab) {
      // Using a unique value (`v`) ensures that Next.js router
      // triggers a navigation even if the base URL is the same.
      router.push(`/search/view?v=${Date.now()}`);
    }
  // We only want this effect to run when the active tab ID changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);


  const addTab = (url: string, title?: string) => {
    const newTab: Tab = {
      id: createUniqueId(),
      url: url,
      title: title || (url === 'koogle:newtab' ? 'New Tab' : (url.startsWith('koogle:search') ? url.split('?q=')[1] : url)),
    };
    
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab && activeTab.url === 'koogle:newtab') {
      // If the current tab is a blank "New Tab", replace it instead of adding a new one.
      setTabs(prevTabs => prevTabs.map(t => t.id === activeTabId ? newTab : t));
    } else {
      setTabs(prevTabs => [...prevTabs, newTab]);
    }
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;

    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      if (newTabs.length > 0) {
        const newActiveIndex = Math.max(0, tabIndex - 1);
        setActiveTabId(newTabs[newActiveIndex].id);
      } else {
        // If all tabs are closed, create a new one.
        const homeTab = createNewTab();
        setTabs([homeTab]);
        setActiveTabId(homeTab.id);
      }
    }
  };

  const setActiveTab = (tabId: string) => {
    if (tabId !== activeTabId) {
      setActiveTabId(tabId);
    }
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
