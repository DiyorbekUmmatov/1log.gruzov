import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaGlobe, FaPhoneSquareAlt, FaShareSquare, FaUser } from "react-icons/fa";

import { TbBrandTelegram, TbBrandWhatsapp } from "react-icons/tb";
import { usePatchCargoActionsMutation } from "@/features/cargo/cargoApi";
import type { Cargo, UpdateData } from "@/shared/types/cargo";
import { Counts } from "@/entities/Cargo/ui/Counts";
import { FiEye, FiPhone, FiShare2 } from "react-icons/fi";

interface ModalProps {
  modal: boolean;
  close: () => void;
  cargo: Cargo | null;
}

export const ContactModal: React.FC<ModalProps> = ({ modal, close, cargo }) => {
  const { t, i18n } = useTranslation();
  const [patchCargo] = usePatchCargoActionsMutation();
  const iconStyle = { fontSize: 18, color: "gray" };

  const handleClick = async (field: keyof UpdateData) => {
    if (!cargo?.id) return;
    try {
      await patchCargo({ cargoId: cargo.id, data: { [field]: true } }).unwrap();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (!modal) return null;

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white backdrop-blur-xl rounded-3xl shadow-lg shadow-black/10 p-6 animate-scaleIn"
      >
        <h2 className="text-center font-semibold text-2xl mb-6 text-[#041e90]">
          {t("contactModal.title")}
        </h2>

        <div className="flex flex-col gap-5">
          {cargo?.full_name && (
            <div className="flex items-center gap-3">
              <FaUser className="text-2xl text-gray-700" />
              <span className="text-lg font-medium text-gray-800">{cargo.full_name}</span>
            </div>
          )}

          {cargo?.phone &&
            cargo.phone.split(/[,|]/).map((item, index) => {
              const phone = item.trim().replace(/\s+/g, "");
              return (
                <div key={index} className="flex items-center gap-3">
                  <FaPhoneSquareAlt className="text-2xl text-lime-600" />
                  <button
                    className="text-blue-700 underline text-base"
                    onClick={() => {
                      window.open(`tel:${phone}`, "_blank");
                      handleClick("phoned");
                    }}
                  >
                    {item.trim()}
                  </button>
                </div>
              );
            })}

          {cargo?.username && (
            <div className="flex items-center gap-3">
              <TbBrandTelegram className="text-2xl text-[#408CFD]" />
              <span className="text-base text-gray-700">
                {i18n.language === "ru" && t("contactModal.write_in")}{" "}
                <Link
                  to={`https://t.me/${cargo.username}`}
                  target="_blank"
                  className="text-[#408CFD] underline"
                  onClick={() => handleClick("chatted_telegram")}
                >
                  Telegram
                </Link>
                {i18n.language !== "ru" && ` ${t("contactModal.write_in")}`}
              </span>
            </div>
          )}

          {cargo?.whatsup && (
            <div className="flex items-center gap-3">
              <TbBrandWhatsapp className="text-2xl text-[#34C759]" />
              <span className="text-base text-gray-700">
                {i18n.language === "ru" && t("contactModal.write_in")}{" "}
                <Link
                  to={`https://wa.me/${cargo.whatsup}`}
                  target="_blank"
                  className="text-[#34C759] underline"
                  onClick={() => handleClick("chatted_whatsup")}
                >
                  WhatsApp
                </Link>
                {i18n.language !== "ru" && ` ${t("contactModal.write_in")}`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <FaGlobe className="text-2xl text-gray-700" />
            <span className="text-base text-gray-700">
              {t("contactModal.source")}{" "}
              <a
                href={cargo?.telegram_group || cargo?.source || "https://t.me/"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline"
              >
                {t("contactModal.group")}
              </a>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <FaShareSquare className="text-2xl text-gray-700" />
            <button
              onClick={async () => {
                const message = t("shareMessage");
                try {
                  if (navigator.share) {
                    await navigator.share({ text: message });
                  } else {
                    window.open(
                      `https://t.me/share/url?text=${encodeURIComponent(message)}`,
                      "_blank"
                    );
                  }
                } catch (err) {
                  console.error("Share failed:", err);
                }
                handleClick("shared");
              }}
              className="text-blue-700 underline text-base"
            >
              {t("contactModal.share")}
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
            {[
              { icon: <FiEye {...iconStyle} />, count: cargo?.viewed },
              { icon: <FiPhone {...iconStyle} />, count: cargo?.phoned },
              {
                icon: <TbBrandTelegram {...iconStyle} />,
                count: cargo?.chatted_telegram,
              },
              { icon: <TbBrandWhatsapp {...iconStyle} />, count: cargo?.chatted_whatsup },
              { icon: <FiShare2 {...iconStyle} />, count: cargo?.shared },
            ].map((c, idx) => (
              <Counts key={idx} icon={c.icon} count={c.count} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
