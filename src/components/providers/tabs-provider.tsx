
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
    if (isInitialMount.current) {
      if (tabs.length === 0) {
        const homeTab = createNewTab();
        setTabs([homeTab]);
        setActiveTabId(homeTab.id);
      }
      isInitialMount.current = false;
    }
  }, [tabs.length]);
  

  const addTab = (url: string, title?: string) => {
    const newTab: Tab = {
      id: createUniqueId(),
      url: url,
      title: title || (url === 'koogle:newtab' ? 'New Tab' : (url.startsWith('koogle:search') ? decodeURIComponent(url.split('?q=')[1]) : url)),
    };

    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;

    // Create the new list of tabs by filtering out the closed one
    const newTabs = tabs.filter(tab => tab.id !== tabId);

    // If there are no tabs left, create a new default tab
    if (newTabs.length === 0) {
      const homeTab = createNewTab();
      setTabs([homeTab]);
      setActiveTabId(homeTab.id);
      return;
    }
    
    // If the closed tab was the active one, decide on the next active tab
    if (activeTabId === tabId) {
        // If the closed tab was the last one, activate the one before it
        // Otherwise, activate the one at the same index (which is the one after the closed one)
        const newActiveIndex = tabIndex >= newTabs.length ? newTabs.length - 1 : tabIndex;
        setActiveTabId(newTabs[newActiveIndex].id);
    }
    
    // Set the new state for the tabs
    setTabs(newTabs);
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
