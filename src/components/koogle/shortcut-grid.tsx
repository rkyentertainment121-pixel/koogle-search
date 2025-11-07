import { Github, Mail, Shield, Youtube } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const shortcuts = [
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com', color: 'text-red-500' },
  { name: 'Gmail', icon: Mail, url: 'https://gmail.com', color: 'text-blue-500' },
  { name: 'GitHub', icon: Github, url: 'https://github.com', color: 'text-foreground' },
  { name: 'Privacy', icon: Shield, url: '#', color: 'text-green-500' },
];

export default function ShortcutGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md">
      {shortcuts.map((shortcut) => (
        <a href={shortcut.url} key={shortcut.name} target="_blank" rel="noopener noreferrer" className="group">
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
