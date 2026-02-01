import { SearchTab } from "@/entities/SearchTab";
import { SearchForm } from "@/entities/SearchForm";

export const SearchContainer = () => {
  return (
    <section className="w-full mx-auto glass-panel p-[18px] rounded-[28px]">
      <div>
        <SearchTab />
        <SearchForm />
      </div>
    </section>
  );
};
