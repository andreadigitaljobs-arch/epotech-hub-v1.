"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavigationProgress() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Trigger bar on every route change
    setShow(true);
    setKey(prev => prev + 1);
    const timer = setTimeout(() => setShow(false), 550);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!show) return null;

  return (
    <div
      key={key}
      className="nav-progress-bar"
      style={{ width: "100%" }}
    />
  );
}
