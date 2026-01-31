import { useState } from "react";
import { useAppTranslation } from "@/shared/lib/useAppTranslation";
import { usePWAInstall } from "@/shared/lib/usePWAInstall";
import "@/shared/ui/Modal/modal.css";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuModal({ isOpen, onClose }: MenuModalProps) {
  const { t } = useAppTranslation();
  const { canInstall, install, installed, isIOS } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);

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

  return (
    <div onClick={onClose} className={`modal ${isOpen ? "open" : ""}`}>
      <div onClick={(e) => e.stopPropagation()} className="modal_content">
        <h2 className="font-bold text-xl text-center">{t("pwa.title")}</h2>

        <div className="mt-4 space-y-4">
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
              <button disabled className="button_long opacity-60">
                {t("pwa.install")}
              </button>

              <div className="space-y-2 text-sm text-gray-800">
                <p className="font-semibold">{t("pwa.iosTitle")}</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>{t("pwa.iosStep1")}</li>
                  <li>{t("pwa.iosStep2")}</li>
                  <li>{t("pwa.iosStep3")}</li>
                  <li>{t("pwa.iosStep4")}</li>
                </ol>
                <p className="text-xs text-gray-500">{t("pwa.iosNote")}</p>
              </div>
            </div>
          ) : (
            <>
              <button disabled className="button_long opacity-60">
                {t("pwa.install")}
              </button>
              <p className="text-center text-gray-700">{t("pwa.notAvailable")}</p>
            </>
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
