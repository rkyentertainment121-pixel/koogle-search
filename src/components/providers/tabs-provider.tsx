
'use client';

import React, { createContext, useState, ReactNode, useEffect, useRef } from 'react';
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

const createNewTab = (url: string = 'koogle:newtab', title?: string): Tab => ({
  id: createUniqueId(),
  url: url,
  title: title || (url === 'koogle:newtab' ? 'New Tab' : (url.startsWith('koogle:search') ? decodeURIComponent(url.split('?q=')[1]) : url)),
});

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  useEffect(() => {
    // On initial load, if there are no tabs, create one.
    if (tabs.length === 0) {
      const homeTab = createNewTab();
      setTabs([homeTab]);
      setActiveTabId(homeTab.id);
    }
  }, []); // Runs only once on mount

  const addTab = (url: string, title?: string) => {
    const newTab = createNewTab(url, title);
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;

    let newActiveTabId = activeTabId;

    if (activeTabId === tabId) {
      if (tabs.length > 1) {
        newActiveTabId = tabs[tabIndex > 0 ? tabIndex - 1 : 0].id;
        if(newActiveTabId === tabId && tabs.length > 1) { // if the next tab is the one we are closing
            newActiveTabId = tabs[tabIndex + 1] ? tabs[tabIndex + 1].id : tabs[0].id;
        } else if (newActiveTabId === tabId && tabs.length === 1) { // last tab case
            newActiveTabId = null;
        } else if (tabIndex === 0 && tabs.length > 1) {
            newActiveTabId = tabs[1].id;
        }
      } else {
        newActiveTabId = null;
      }
    }
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);

    if (newTabs.length === 0) {
      const homeTab = createNewTab();
      setTabs([homeTab]);
      setActiveTabId(homeTab.id);
    } else {
      setTabs(newTabs);
      // If the active tab was closed, we need to make sure the new active tab is correct
      if (activeTabId === tabId) {
          const newActiveIndex = Math.max(0, tabIndex - 1);
          setActiveTabId(newTabs[newActiveIndex].id);
      } else {
          setActiveTabId(activeTabId);
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
