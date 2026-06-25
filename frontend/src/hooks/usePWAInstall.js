import { useEffect, useState } from "react";

export function usePWAInstall() {
  const [prompt, setPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone
    ) {
      setIsInstalled(true);
      return;
    }

    const onPrompt = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    const onInstalled = () => {
      setPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setPrompt(null);
      setIsInstalled(true);
    }
  }

  const canInstall = !isInstalled && (prompt !== null || isIOS);

  return { install, canInstall, isInstalled, isIOS, hasNativePrompt: prompt !== null };
}
