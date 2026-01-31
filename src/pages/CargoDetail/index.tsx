import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppTranslation } from "@/shared/lib/useAppTranslation";
import { Cargo } from "@/entities/Cargo";
import { IoIosArrowBack } from "react-icons/io";

export const CargoDetail = () => {
  const { id } = useParams();
  const { t } = useAppTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-[15px]">
      <div className="relative flex items-center justify-between pb-10">
        <button
          onClick={() => window.history.back()}
          className="w-8 h-8 rounded-full bg-[#041e90] font-bold text-2xl text-white grid place-content-center"
        >
          <IoIosArrowBack />
        </button>
        <h2 className="font-medium text-3xl absolute left-1/2 -translate-x-1/2">
          {t("detail")}
        </h2>
      </div>
      <Cargo id={id} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <button
        onClick={() => setIsModalOpen(true)}
        className="block w-3/4 sm:w-3/5 mx-auto p-4 bg-[#041e90] rounded-xl font-semibold text-lg sm:text-xl text-white mt-8"
      >
        {t("showContacts")}
      </button>
    </section>
  );
};
