import * as tauriApp from "@tauri-apps/api/app";
import * as osPlugin from "@tauri-apps/plugin-os";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    __EXPO__?: {
      platform: "ios" | "android";
      onToggleSidebar: (handler: () => void) => void;
    };
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export const getTauriPlatform = () => {
  if (typeof window !== "undefined" && window.__TAURI_OS_PLUGIN_INTERNALS__) return osPlugin.type();
  return null;
};

export const getExpoPlatform = () => {
  if (typeof window !== "undefined" && window.__EXPO__) return window.__EXPO__.platform;
  return null;
};

export const getNativePlatform = () => getTauriPlatform() ?? getExpoPlatform() ?? null;

export const useNativePlatform = () => {
  const [platform, setPlatform] = useState<ReturnType<typeof getNativePlatform>>(null);
  const [isLegacyTauri, setIsLegacyTauri] = useState(false);

  useEffect(() => {
    setPlatform(getNativePlatform());
    if (getTauriPlatform()) {
      tauriApp.getVersion().then((version) => setIsLegacyTauri(parseInt(version.replaceAll(".", "")) < 105));
    }
  }, []);

  return {
    nativePlatform: platform,
    isTauri: platform === "macos" || platform === "windows" || platform === "linux",
    isExpo: platform === "ios" || platform === "android",
    isLegacyTauri,
    isWeb: !platform,
    isDesktopWeb: !platform && typeof navigator !== "undefined" && !/Android|iPhone|iPad/i.test(navigator.userAgent),
    isMobileWeb: !platform && typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent),
  };
};
