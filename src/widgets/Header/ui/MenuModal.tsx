import { useEffect, useMemo, useState } from "react";
import { useAppTranslation } from "@/shared/lib/useAppTranslation";
import { usePWAInstall } from "@/shared/lib/usePWAInstall";
import { isTMA, openLink } from "@telegram-apps/sdk";
import "@/shared/ui/Modal/modal.css";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInstructions: () => void;
}

export function MenuModal({ isOpen, onClose, onOpenInstructions }: MenuModalProps) {
  const { t } = useAppTranslation();
  const { canInstall, install, installed, isIOS } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(false);

  const isAndroid = useMemo(() => /Android/i.test(navigator.userAgent), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const value = await isTMA();
        if (!cancelled) setIsMiniApp(value);
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const getInstallPageUrl = () => {
    const url = new URL(`${import.meta.env.BASE_URL}install`, window.location.origin);
    const lang = localStorage.getItem("lang");

    if (lang) url.searchParams.set("lang", lang);
    if (isMiniApp) url.searchParams.set("from", "tma");

    return url.toString();
  };

  const handleInstall = async () => {
    if (isInstalling) return;
    setIsInstalling(true);
    try {
      const outcome = await install();
      if (outcome === "accepted") onClose();
    } finally {
      setIsInstalling(false);
    }
  };

  const openInBrowser = () => {
    const url = getInstallPageUrl();

    try {
      if (isMiniApp && openLink.isAvailable()) {
        const tryBrowser = isAndroid ? "chrome" : isIOS ? "google-chrome" : undefined;
        openLink(url, tryBrowser ? { tryBrowser } : undefined);
      } else {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    } finally {
      onClose();
    }
  };

  const openOtherMiniApp = () => {
    const url = "https://1log-one.vercel.app/";
    try {
      if (isMiniApp && openLink.isAvailable()) {
        const tryBrowser = isAndroid ? "chrome" : isIOS ? "google-chrome" : undefined;
        openLink(url, tryBrowser ? { tryBrowser } : undefined);
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      onClose();
    }
  };

  return (
    <div onClick={onClose} className={`modal ${isOpen ? "open" : ""}`}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal_content"
        data-swipe-ignore="true"
      >
        <h2 className="font-bold text-xl text-center">{t("menu.title")}</h2>

        <div className="mt-4 space-y-3">
          <button onClick={openOtherMiniApp} className="button_long">
            {t("menu.openMiniApp")}
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenInstructions();
            }}
            className="button_long"
          >
            {t("menu.instructions")}
          </button>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-sm text-gray-700 mb-2">{t("pwa.title")}</h3>
        </div>

        <div className="space-y-4">
          {installed ? (
            <button disabled className="button_long opacity-60">
              {t("pwa.installed")}
            </button>
          ) : canInstall ? (
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="button_long disabled:opacity-60"
            >
              {isInstalling ? t("pwa.installing") : t("pwa.install")}
            </button>
          ) : isIOS ? (
            <div className="space-y-3">
              <button onClick={openInBrowser} className="button_long">
                {t("pwa.install")}
              </button>
              <div className="text-sm text-gray-800">
                <p className="font-semibold">{t("pwa.iosTitle")}</p>
                <ol className="list-decimal pl-5 space-y-1 mt-2">
                  <li>{t("pwa.iosStep1")}</li>
                  <li>{t("pwa.iosStep2")}</li>
                  <li>{t("pwa.iosStep3")}</li>
                  <li>{t("pwa.iosStep4")}</li>
                </ol>
                <p className="text-xs text-gray-500 mt-2">{t("pwa.iosNote")}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button onClick={openInBrowser} className="button_long">
                {t("pwa.install")}
              </button>
              <p className="text-center text-sm text-gray-700">
                {isMiniApp ? t("pwa.telegramHint") : t("pwa.androidHint")}
              </p>
            </div>
          )}
        </div>

        <div className="w-full flex justify-center mt-6">
          <button onClick={onClose} className="button_short">
            {t("done")}
          </button>
        </div>
      </div>
    </div>
  );
}
