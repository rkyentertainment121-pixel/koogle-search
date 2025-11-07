"use client"

import { useCounter } from "@/hooks/use-counter";
import { Shield, Ban, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

const PrivacyStats = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const trackers = useCounter(isMounted ? 133742 : 0, 1500);
    const ads = useCounter(isMounted ? 98231 : 0, 1500);
    const time = useCounter(isMounted ? 15 : 0, 1500);

  const stats = [
    {
      icon: Shield,
      value: trackers,
      label: "Trackers Blocked",
    },
    {
      icon: Ban,
      value: ads,
      label: "Ads Blocked",
    },
    {
      icon: Clock,
      value: time,
      label: "Minutes Saved",
    },
  ];

  return (
    <footer className="w-full border-t p-4 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-center gap-3">
              <stat.icon className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="text-xl font-bold font-headline">
                  {Math.floor(stat.value).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default PrivacyStats;
