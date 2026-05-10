import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Laptop, Smartphone } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if it was recently dismissed
    const lastDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (lastDismissed && Date.now() - parseInt(lastDismissed) < 24 * 60 * 60 * 1000) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not show again for 24 hours
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[9999]"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-indigo-100 dark:border-indigo-900/50 overflow-hidden">
            <div className="relative p-6">
              <button 
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pr-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    Install TeamTask App
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Get a faster, smoother experience by installing our app on your device.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  <div className="flex items-center gap-1">
                    <Laptop className="w-3 h-3" /> Desktop
                  </div>
                  <span className="opacity-30">•</span>
                  <div className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3" /> Mobile
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    Not now
                  </button>
                  <button
                    onClick={handleInstall}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md shadow-indigo-500/20 transition-all transform active:scale-95"
                  >
                    Install Now
                  </button>
                </div>
              </div>
            </div>
            
            {/* Decoration line */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
