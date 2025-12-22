"use client";

import { useState, useEffect } from "react";
import { X, Smartphone } from "lucide-react";
import { InstallInstructionsModal } from "@/components/install-instructions-modal";

export function InstallAppBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile - runs once on mount
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(checkMobile);

    if (!checkMobile) return;

    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    // Check if banner was dismissed
    const dismissed = localStorage.getItem("installBannerDismissed");
    const dismissedDate = dismissed ? new Date(dismissed) : null;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Show banner if never dismissed or dismissed more than 7 days ago
    if (!dismissed || (dismissedDate && dismissedDate < sevenDaysAgo)) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("installBannerDismissed", new Date().toISOString());
  };

  const handleGetApp = () => {
    setShowModal(true);
  };

  if (!isVisible || !isMobile) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white shadow-lg border-b border-blue-500/20">
        <div className="flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 flex-1">
            <Smartphone className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Get the Bookfolio app</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGetApp}
              className="text-xs font-semibold bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 dark:hover:bg-white/10 rounded transition-colors flex-shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add padding to body to prevent content from being hidden under banner */}
      <div className="h-[42px]" />

      <InstallInstructionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
