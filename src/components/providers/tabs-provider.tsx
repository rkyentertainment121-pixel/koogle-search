
'use client';

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { Tab, SearchEngine } from '@/lib/types';

interface TabsContextType {
  tabs: Tab[];
  activeTab: Tab | null;
  addTab: (url: string, title?: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabTitle: (tabId: string, title: string) => void;
  defaultSearchEngine: SearchEngine;
  setDefaultSearchEngine: (engine: SearchEngine) => void;
}

export const TabsContext = createContext<TabsContextType>({
  tabs: [],
  activeTab: null,
  addTab: () => {},
  closeTab: () => {},
  setActiveTab: () => {},
  updateTabTitle: () => {},
  defaultSearchEngine: 'koogle',
  setDefaultSearchEngine: () => {},
});

const createUniqueId = () => `tab-${Date.now()}-${Math.random()}`;

const createNewTab = (url: string = 'koogle:newtab', title?: string): Tab => {
    let tabTitle = title;
    if (!tabTitle) {
        if (url === 'koogle:newtab') {
            tabTitle = 'New Tab';
        } else if (url.startsWith('koogle:search')) {
            try {
                tabTitle = decodeURIComponent(url.split('?q=')[1].split('&')[0]);
            } catch (e) {
                tabTitle = 'Search';
            }
        } else {
            try {
                tabTitle = new URL(url).hostname;
            } catch (e) {
                tabTitle = url;
            }
        }
    }
    return {
        id: createUniqueId(),
        url: url,
        title: tabTitle,
    };
};

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [defaultSearchEngine, setDefaultSearchEngineState] = useState<SearchEngine>('koogle');

  useEffect(() => {
    const savedEngine = localStorage.getItem('searchEngine') as SearchEngine;
    if (savedEngine) {
      setDefaultSearchEngineState(savedEngine);
    }
    
    // On initial load, if there are no tabs, create one.
    if (tabs.length === 0) {
      const initialTab = createNewTab();
      setTabs([initialTab]);
      setActiveTabId(initialTab.id);
    }
  }, []);

  const addTab = (url: string, title?: string) => {
    const newTab = createNewTab(url, title);
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;

    const newTabs = tabs.filter(tab => tab.id !== tabId);

    if (newTabs.length === 0) {
      const homeTab = createNewTab();
      setTabs([homeTab]);
      setActiveTabId(homeTab.id);
      return;
    }

    if (activeTabId === tabId) {
      const newActiveIndex = Math.max(0, tabIndex - 1);
      setActiveTabId(newTabs[newActiveIndex].id);
    }

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

  const setDefaultSearchEngine = (engine: SearchEngine) => {
    setDefaultSearchEngineState(engine);
    localStorage.setItem('searchEngine', engine);
  };
  
  const activeTab = tabs.find(t => t.id === activeTabId) || null;

  const value = {
    tabs,
    activeTab,
    addTab,
    closeTab,
    setActiveTab,
    updateTabTitle,
    defaultSearchEngine,
    setDefaultSearchEngine,
  };

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};
