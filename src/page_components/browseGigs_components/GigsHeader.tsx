import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../context/LanguageContext.tsx";

interface GigsHeaderProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
  sortBy?: string;
  onSort?: (sort: string) => void;
}

function GigsHeader({
  searchQuery = "",
  onSearch,
  sortBy = "",
  onSort,
}: GigsHeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const { t } = useLanguage();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearch);
  };

  return (
    <>
      <header className="flex flex-col gap-4 mx-6 mb-4 py-4 bg-(--color-bg)">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl text-(--color-text) font-bold">
            {t("browseGigs.title")}
          </h1>
          <span className="text-md text-(--color-text-muted) font-medium">
            {t("browseGigs.subtitle")}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
            />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t("browseGigs.searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-(--color-surface) border border-(--color-border) text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all"
            />
          </form>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSort?.(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-(--color-surface) border border-(--color-border) text-(--color-text) text-sm focus:outline-none focus:border-(--color-primary) cursor-pointer min-w-[160px]"
          >
            <option value="">{t("browseGigs.sort.placeholder")}</option>
            <option value="newest">{t("browseGigs.sort.newest")}</option>
            <option value="price_low">{t("browseGigs.sort.priceLow")}</option>
            <option value="price_high">{t("browseGigs.sort.priceHigh")}</option>
            <option value="rating">{t("browseGigs.sort.rating")}</option>
            <option value="popular">{t("browseGigs.sort.popular")}</option>
          </select>
        </div>
      </header>
    </>
  );
}

export default GigsHeader;
