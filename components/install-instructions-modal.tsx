"use client";

import { useEffect, useState } from "react";
import { Share, Plus, MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InstallInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallInstructionsModal({
  isOpen,
  onClose,
}: InstallInstructionsModalProps) {
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect platform - runs once on mount
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform("ios");
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    }

    // Listen for beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      onClose();
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[90vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Install Bookfolio
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {platform === "ios" && (
            <>
              <p className="text-sm text-muted-foreground">
                Install Bookfolio on your iPhone or iPad for the best experience:
              </p>
              <div className="space-y-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Tap the <Share className="w-4 h-4 inline mx-1" /> <strong>Share</strong> button at the bottom of Safari
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Scroll down and tap <Plus className="w-4 h-4 inline mx-1" /> <strong>&ldquo;Add to Home Screen&rdquo;</strong>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Tap <strong>&ldquo;Add&rdquo;</strong> in the top right corner
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                The Bookfolio icon will appear on your home screen like a native app!
              </p>
            </>
          )}

          {platform === "android" && deferredPrompt && (
            <>
              <p className="text-sm text-muted-foreground">
                Install Bookfolio on your Android device for quick access and offline support:
              </p>
              <Button
                onClick={handleInstallClick}
                className="w-full"
                size="lg"
              >
                Install App
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Tap the button above to install Bookfolio
              </p>
            </>
          )}

          {platform === "android" && !deferredPrompt && (
            <>
              <p className="text-sm text-muted-foreground">
                Install Bookfolio on your Android device:
              </p>
              <div className="space-y-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Tap the <MoreVertical className="w-4 h-4 inline mx-1" /> <strong>menu</strong> button in Chrome
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Tap <strong>&ldquo;Add to Home screen&rdquo;</strong> or <strong>&ldquo;Install app&rdquo;</strong>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Tap <strong>&ldquo;Install&rdquo;</strong> or <strong>&ldquo;Add&rdquo;</strong>
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                The Bookfolio icon will appear on your home screen!
              </p>
            </>
          )}

          {platform === "other" && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Please open this page in Safari (iOS) or Chrome (Android) to install the app.
            </p>
          )}

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
