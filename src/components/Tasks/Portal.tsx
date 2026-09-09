"use client";

type portalProps = {
    children: React.ReactNode;
}

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }: portalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Only render on the client side once the document is available
  return mounted ? createPortal(children, document.body) : null;
}
