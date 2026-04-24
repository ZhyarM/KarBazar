import { useEffect, useState } from "react";
import { handleSearchSubmit } from "../../utils/HandleFormSearch";
import { useLanguage } from "../../context/LanguageContext.tsx";
import { useSearch } from "../../context/SearchContext.tsx";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onInputChange?: (query: string) => void;
}

function SearchBar({ onSearch, onInputChange }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const { direction, t } = useLanguage();
  const { searchQuery, setSearchQuery } = useSearch();
  const isRTL = direction === "rtl";

  // Sync local state with context
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!onInputChange) {
      return;
    }

    const timeout = setTimeout(() => {
      onInputChange(query);
      setSearchQuery(query);
    }, 120);

    return () => clearTimeout(timeout);
  }, [query, onInputChange, setSearchQuery]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSearch) {
          onSearch(query);
          return;
        }
        handleSearchSubmit(e, onSearch);
      }}
      className="relative flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none absolute ${isRTL ? "right-3" : "left-3"} h-4 w-4 text-(--color-text)`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z"
        />
      </svg>

      <input
        type="search"
        name="q"
        dir={direction}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("search.placeholder")}
        className={`
    h-11
    w-1/4 sm:w-64 md:w-80 lg:w-[400px] 
      ${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} text-sm
    rounded-4xl 
    bg-(--color-surface)
    placeholder-gray-400
    text-(--color-text)
    shadow-md
   
    focus:outline-none focus:ring-2 focus:ring-(--color-primary)
    transition-all duration-300 hover:shadow-md
  `}
      />
    </form>
  );
}

export default SearchBar;
