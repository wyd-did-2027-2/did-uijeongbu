"use client";

import { useState, useEffect, startTransition } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { content, type Locale } from "@/lib/content";

const POPUP_STORAGE_KEY = "popup_hidden_until";

export default function Popup({ locale = "kr" }: { locale?: Locale }) {
  const t = content[locale];
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hiddenUntil = localStorage.getItem(POPUP_STORAGE_KEY);
    if (hiddenUntil) {
      const hideDate = new Date(hiddenUntil);
      if (new Date() < hideDate) {
        return;
      }
    }
    startTransition(() => {
      setIsOpen(true);
    });
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleHideFor7Days = () => {
    const hideUntil = new Date();
    hideUntil.setDate(hideUntil.getDate() + 7);
    localStorage.setItem(POPUP_STORAGE_KEY, hideUntil.toISOString());
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden"
        showCloseButton={false}
      >
        <div className="relative w-full aspect-square">
          <Image
            src=""
            alt="팝업 이미지"
            fill
            className="object-cover"
          />
        </div>

        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="heading04B text-gray-900">
            {t.popup.title}
          </DialogTitle>
          <DialogDescription className="body02R text-gray-900">
            {t.popup.description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row border-t border-border p-0 sm:flex-row sm:justify-stretch gap-x-0">
          <button
            onClick={handleHideFor7Days}
            className="flex-1 py-4 body02M text-muted-foreground hover:bg-gray-50 transition-colors border-r border-border"
          >
            {t.common.hideFor7Days}
          </button>
          <button
            onClick={handleClose}
            className="flex-1 py-4 body02M text-foreground hover:bg-gray-50 transition-colors"
          >
            {t.common.close}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
