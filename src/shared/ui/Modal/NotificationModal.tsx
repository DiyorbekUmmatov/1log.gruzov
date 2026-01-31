import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useAddRouteMutation, useDeleteRouteMutation } from "@/features/routes/routesApi";
import { useAppSelector } from "@/app/hooks";
import { Slider } from "../Input/Slider";
import "./modal.css";

interface ModalProps {
  modal: boolean;
  close: () => void;
  origin: string;
  destination: string;
  isChecked: boolean;
}

export const NotificationModal: React.FC<ModalProps> = ({
  modal,
  close,
  origin,
  destination,
  isChecked,
}) => {
  const { t } = useTranslation();
  const userId = useAppSelector((state) => state.user.userId);
  const [loading, setLoading] = useState(false);

  const [addRoute] = useAddRouteMutation();
  const [deleteRoute] = useDeleteRouteMutation();

  const setNotification = async (enabled: boolean) => {
    if (!userId) return;

    setLoading(true);
    try {
      if (enabled) {
        await addRoute({ origin, destination, user: Number(userId) }).unwrap();
      } else {
        await deleteRoute({ origin, destination, user: Number(userId) }).unwrap();
      }
    } catch (err) {
      console.error("Notification update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={close} className={`modal ${modal ? "open" : ""}`}>
      <div onClick={(e) => e.stopPropagation()} className="modal_content">
        <h2 className="font-bold text-xl text-center">{t("nav.notifications")}</h2>
        <div className="sm:px-10 py-5">
          <div className="my-5 flex flex-col gap-y-3">
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-start gap-2 text-sm sm:text-base">
                <FaMapMarkedAlt className="mt-0.5 text-blue-500 text-lg" />
                <span>
                  <span className="font-semibold">{t("notification.option1_bold")}</span>{" "}
                  — {t("notification.option1_normal")}
                </span>
              </div>
              <Slider checked={isChecked} disabled={loading} onChange={setNotification} />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <button onClick={close} className="button_short">
            {t("done")}
          </button>
        </div>
      </div>
    </div>
  );
};
