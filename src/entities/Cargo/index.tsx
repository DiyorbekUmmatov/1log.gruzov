import { useTranslation } from "react-i18next";
import { skipToken } from "@reduxjs/toolkit/query";
import { ContactModal } from "@/shared/ui/Modal/ContactModal";
import { useGetCargoByIdQuery } from "@/features/cargo/cargoApi";
import {
  FaEye,
  FaPhoneAlt,
  FaShareSquare,
  FaTelegram,
  FaWhatsappSquare,
} from "react-icons/fa";
import { Counts } from "./ui/Counts";

export const Cargo = ({
  id,
  isModalOpen,
  setIsModalOpen,
}: {
  id: string | undefined;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();

  const cargoId = id ? Number(id) : NaN;
  const { data, isLoading, error } = useGetCargoByIdQuery(
    Number.isFinite(cargoId) ? cargoId : skipToken
  );

  const counts = [
    { icon: <FaEye fontSize={24} color="gray" />, count: data?.viewed },
    { icon: <FaPhoneAlt fontSize={24} color="gray" />, count: data?.phoned },
    {
      icon: <FaTelegram fontSize={24} color="gray" />,
      count: data?.chatted_telegram,
    },
    {
      icon: <FaWhatsappSquare fontSize={24} color="gray" />,
      count: data?.chatted_whatsup,
    },
    { icon: <FaShareSquare fontSize={24} color="gray" />, count: data?.shared },
  ];

  return (
    <div className="py-[30px] border-y-2 border-y-gray-400">
      {isLoading ? (
        <div className="text-center">{t("loading")}</div>
      ) : error ? (
        <div className="text-red-500 text-center">{JSON.stringify(error)}</div>
      ) : (
        <div className="mt-[30px] flex items-center justify-center gap-6">
          {counts.map((c, index) => (
            <Counts key={index} icon={c.icon} count={c.count} />
          ))}
        </div>
      )}

      <ContactModal
        modal={isModalOpen}
        close={() => setIsModalOpen(false)}
        cargo={data ?? null}
      />
    </div>
  );
};
