import { handleSearchSubmit } from "./../utils/HandleFormSearch";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <form
      onSubmit={(e) => handleSearchSubmit(e, onSearch)}
      className="relative flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400 dark:text-gray-300"
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
        placeholder="Search for services..."
        className="h-9 w-40 sm:w-56 md:w-72 lg:w-80 pl-9 pr-3 text-sm
                   rounded-md border border-gray-300 dark:border-gray-600
                   bg-gray-50 dark:bg-gray-800
                   text-gray-800 dark:text-gray-100
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition-all duration-300 hover:shadow-md"
      />
    </form>
  );
}

export default SearchBar;
