import { useState } from "react";
import { FaUpLong } from "react-icons/fa6";

interface ValueExchangeButtonProps {
  valueChange: () => void;
}

export const ValueExchangeButton: React.FC<ValueExchangeButtonProps> = ({
  valueChange,
}) => {
  const [isExchanging, setIsExchanging] = useState(false);

  const handleClick = () => {
    if (isExchanging) return;

    setIsExchanging(true);
    valueChange();

    setTimeout(() => {
      setIsExchanging(false);
    }, 400);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isExchanging}
      className={`
        absolute z-40 right-10 top-1/2 -translate-y-1/2
        w-10 h-10 bg-[#FF9F4C] border-2 border-[#FF9F4C] rounded-full 
        flex items-center justify-center 
        transition-all duration-300
        ${
          isExchanging
            ? "scale-90 cursor-not-allowed opacity-70"
            : "hover:bg-[#0628b5] hover:border-[#0628b5] cursor-pointer hover:scale-110"
        }
      `}
    >
      <div
        className={`
        flex items-center justify-center
        transition-transform duration-400
        ${isExchanging ? "rotate-180" : ""}
      `}
      >
        <FaUpLong className="w-2.5 font-bold text-lg text-white" />
        <FaUpLong className="rotate-180 w-2.5 font-bold text-lg text-white" />
      </div>
    </button>
  );
};
