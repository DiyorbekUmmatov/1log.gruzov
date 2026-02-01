import { useEffect, useMemo, useRef, useState } from "react";
import { useAppTranslation } from "@/shared/lib/useAppTranslation";
import { isTMA, openLink } from "@telegram-apps/sdk";
import "@/shared/ui/Modal/modal.css";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionModal({ isOpen, onClose }: InstructionModalProps) {
  const { t } = useAppTranslation();
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [resolved, setResolved] = useState<{
    src: string;
    type: "video/mp4" | "video/quicktime";
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSrc = useMemo(() => {
    return new URL("../../../assets/instruksya.MOV", import.meta.url).toString();
  }, []);

  const mp4Url = useMemo(() => {
    return new URL(
      `${import.meta.env.BASE_URL}instruksya.mp4`,
      window.location.origin
    ).toString();
  }, []);

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

  useEffect(() => {
    if (!isOpen) return;
    const probe = document.createElement("video");
    const canQuickTime = probe.canPlayType("video/quicktime");
    setIsSupported(Boolean(canQuickTime));

    const canMp4 = Boolean(probe.canPlayType("video/mp4"));
    if (!canMp4) {
      setResolved({ src: videoSrc, type: "video/quicktime" });
      return;
    }

    (async () => {
      try {
        const res = await fetch(mp4Url, { method: "HEAD" });
        if (res.ok) {
          setResolved({ src: mp4Url, type: "video/mp4" });
        } else {
          setResolved({ src: videoSrc, type: "video/quicktime" });
        }
      } catch {
        setResolved({ src: videoSrc, type: "video/quicktime" });
      }
    })();
  }, [isOpen, mp4Url, videoSrc]);

  const openInBrowser = () => {
    const urlToOpen = resolved?.src ?? videoSrc;
    try {
      if (isMiniApp && openLink.isAvailable()) {
        openLink(urlToOpen, { tryBrowser: "chrome" });
      } else {
        window.open(urlToOpen, "_blank", "noopener,noreferrer");
      }
    } catch {
      window.open(urlToOpen, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      onClick={onClose}
      className={`modal ${isOpen ? "open" : ""}`}
      data-swipe-ignore="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal_content"
        data-swipe-ignore="true"
      >
        <h2 className="font-bold text-xl text-center">{t("menu.instructions")}</h2>

        <div className="mt-4">
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            className="w-full rounded-md bg-black"
            style={{ maxHeight: "70vh" }}
          >
            <source
              src={resolved?.src ?? videoSrc}
              type={resolved?.type ?? "video/quicktime"}
            />
          </video>
        </div>

        {!isSupported && (
          <div className="mt-3 text-sm text-gray-700">
            <p className="text-center">{t("menu.videoHint")}</p>
            <div className="w-full flex justify-center mt-3">
              <button onClick={openInBrowser} className="button_long !mt-0">
                {t("menu.openInBrowser")}
              </button>
            </div>
          </div>
        )}

        <div className="w-full flex justify-center mt-6">
          <button onClick={onClose} className="button_short">
            {t("done")}
          </button>
        </div>
      </div>
    </div>
  );
}
