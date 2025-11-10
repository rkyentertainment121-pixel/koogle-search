
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContext } from 'react';
import { TabsContext } from '../providers/tabs-provider';
import type { SearchEngine } from '@/lib/types';
import { searchEngines } from '@/lib/search-engines';

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { searchEngine, setSearchEngine } = useContext(TabsContext);

  const handleEngineChange = (engine: SearchEngine) => {
    setSearchEngine(engine);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your browsing experience.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="search-engine" className="text-right">
              Search Engine
            </Label>
            <Select
              value={searchEngine}
              onValueChange={handleEngineChange}
            >
              <SelectTrigger id="search-engine" className="col-span-3">
                <SelectValue placeholder="Select a search engine" />
              </SelectTrigger>
              <SelectContent>
                {searchEngines.map((engine) => (
                  <SelectItem key={engine.name} value={engine.name}>
                    {engine.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
