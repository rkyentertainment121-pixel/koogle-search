
'use client';

import { Github, Mail, Shield, Youtube } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useContext } from "react";
import { TabsContext } from "../providers/tabs-provider";

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.5 10.2c.3-.2.5-.5.5-.9s-.2-.7-.5-.9c-.6-.4-1.5-.4-2.1 0-.3.2-.5.5-.5.9s.2.7.5.9c.6.4 1.5.4 2.1 0z" fill="#4285F4"/>
        <path d="M15.5 10.2c-.3.2-.7.3-1.1.3s-.8-.1-1.1-.3c-.6-.4-1.5-.4-2.1 0-.3.2-.5.5-.5.9s.2.7.5.9c.6.4 1.5.4 2.1 0 .3-.2.5-.5.5-.9s-.2-.7-.5-.9z" fill="#34A853"/>
        <path d="M10.2 15.5c.2.3.5.5.9.5s.7-.2.9-.5c.4-.6.4-1.5 0-2.1-.2-.3-.5-.5-.9-.5s-.7.2-.9.5c-.4.6-.4 1.5 0 2.1z" fill="#FBBC05"/>
        <path d="M10.2 15.5c.2-.3.3-.7.3-1.1s-.1-.8-.3-1.1c-.4-.6-.4-1.5 0-2.1.2-.3.5-.5.9-.5s.7.2.9.5c.4.6.4 1.5 0 2.1-.2.3-.5.5-.9.5s-.7-.2-.9-.5z" fill="#EA4335"/>
        <path d="M12 22s-8-2.1-8-10c0-4.4 3.6-8 8-8s8 3.6 8 8c0 7.9-8 10-8 10z" strokeMiterlimit="10" strokeWidth="1.5"/>
    </svg>
)

const shortcuts = [
  { name: 'Google', icon: GoogleIcon, url: 'https://google.com', color: '' },
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com', color: 'text-red-500' },
  { name: 'Gmail', icon: Mail, url: 'https://gmail.com', color: 'text-blue-500' },
  { name: 'GitHub', icon: Github, url: 'https://github.com', color: 'text-foreground' },
];

export default function ShortcutGrid() {
  const { addTab } = useContext(TabsContext);

  const handleShortcutClick = (e: React.MouseEvent, url: string, name: string) => {
    e.preventDefault();
    if (url === '#') return;
    addTab(url, name);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md">
      {shortcuts.map((shortcut) => (
        <a href={shortcut.url} key={shortcut.name} onClick={(e) => handleShortcutClick(e, shortcut.url, shortcut.name)} className="group">
          <Card className="hover:shadow-md transition-shadow hover:bg-card/80">
            <CardContent className="flex flex-col items-center justify-center p-4 aspect-square">
              <div className="p-3 bg-muted rounded-full mb-2">
                <shortcut.icon className={`h-6 w-6 ${shortcut.color}`} />
              </div>
              <p className="text-sm font-medium text-center truncate">{shortcut.name}</p>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
