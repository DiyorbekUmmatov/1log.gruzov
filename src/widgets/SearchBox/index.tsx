import { SearchTab } from "@/entities/SearchTab";
import { SearchForm } from "@/entities/SearchForm";

export const SearchContainer = () => {
  return (
    <section className="w-full mx-auto bg-white p-[18px] rounded-[28px] shadow-xs border-[0.1px] border-[#ccc]">
      <div>
        <SearchTab />
        <SearchForm />
      </div>
    </section>
  );
};
