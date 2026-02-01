import { useEffect, useMemo, useState } from "react";
import { useAppTranslation } from "@/shared/lib/useAppTranslation";
import { usePWAInstall } from "@/shared/lib/usePWAInstall";
import { setLang } from "@/shared/lib/setLang";

function readLangParam(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("lang");
}

function readFromParam(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("from");
}

export const Install = () => {
  const { t, i18n } = useAppTranslation();
  const { canInstall, install, installed, isIOS } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);

  const langParam = useMemo(() => readLangParam(), []);
  const fromParam = useMemo(() => readFromParam(), []);

  useEffect(() => {
    if (!langParam) return;
    localStorage.setItem("lang", langParam);
    i18n.changeLanguage(setLang(langParam));
  }, [i18n, langParam]);

  const handleInstall = async () => {
    if (isInstalling) return;
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 bg-white">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">{t("pwa.pageTitle")}</h1>

        {fromParam === "tma" && (
          <p className="text-center text-sm text-gray-600">{t("pwa.fromTelegram")}</p>
        )}

        {installed ? (
          <div className="space-y-3">
            <p className="text-center text-gray-700">{t("pwa.installed")}</p>
          </div>
        ) : canInstall ? (
          <div className="space-y-3">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full py-3 rounded-lg bg-[#041e90] text-white text-lg font-semibold disabled:opacity-60"
            >
              {isInstalling ? t("pwa.installing") : t("pwa.install")}
            </button>
            <p className="text-center text-sm text-gray-600">{t("pwa.androidHint")}</p>
          </div>
        ) : isIOS ? (
          <div className="space-y-3 text-sm text-gray-800">
            <p className="font-semibold">{t("pwa.iosTitle")}</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t("pwa.iosStep1")}</li>
              <li>{t("pwa.iosStep2")}</li>
              <li>{t("pwa.iosStep3")}</li>
              <li>{t("pwa.iosStep4")}</li>
            </ol>
            <p className="text-xs text-gray-500">{t("pwa.iosNote")}</p>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-gray-800">
            <p className="font-semibold">{t("pwa.androidTitle")}</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t("pwa.androidStep1")}</li>
              <li>{t("pwa.androidStep2")}</li>
              <li>{t("pwa.androidStep3")}</li>
            </ol>
            <p className="text-xs text-gray-500">{t("pwa.notAvailable")}</p>
          </div>
        )}
      </div>
    </main>
  );
};
