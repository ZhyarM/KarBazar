import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearch);
  };

  return (
    <>
      <header className="flex flex-col gap-4 mx-6 mb-4 py-4 bg-(--color-bg)">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl text-(--color-text) font-bold">
            Browse Gigs
          </h1>
          <span className="text-md text-(--color-text-muted) font-medium">
            Discover talented freelancers for your project
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
              placeholder="Search gigs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-(--color-surface) border border-(--color-border) text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all"
            />
          </form>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSort?.(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-(--color-surface) border border-(--color-border) text-(--color-text) text-sm focus:outline-none focus:border-(--color-primary) cursor-pointer min-w-[160px]"
          >
            <option value="">Sort by</option>
            <option value="newest">Newest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </header>
    </>
  );
}

export default GigsHeader;
