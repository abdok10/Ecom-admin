"use client";

import { Button } from "@/components/ui/button";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

export default function SetupPage() {
  const { isOpen, onOpen } = useStoreModal();
  console.log(isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className="p-4">
      <p>Root Page</p>
      <Button onClick={() => {}}>Open Modal</Button>
    </div>
  );
}
