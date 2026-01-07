import Filters from "./../page_components/browseGigs_components/Filters.tsx";
import Header from "./../page_components/browseGigs_components/GigsHeader.tsx";
import GigCard from "../page_components/browseGigs_components/GigCardContainer.tsx";
import { filtersConfig } from "../config/filters.config.ts";
import { useState } from "react";
import { filterUser } from "../services/filterUsers.ts";
import users from "../utils/UserData.tsx";
import type { User } from "../utils/UserData.tsx";

function BrowseGigs() {
  const createInitialFiltersState = () => {
    return filtersConfig.reduce((acc, filter) => {
      acc[filter.id] = filter.defaultValue;
      return acc;
    }, {} as Record<string, any>);
  };

  const [filters, setFilters] = useState(createInitialFiltersState);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  const applyFilters = () => {
    const result = filterUser(users, filters);
    setFilteredUsers(result);
  };

  return (
    <>
      <section className="bg-(--color-bg) pb-4 px-5">
        <Header />
        <div className="flex flex-col justify-between gap-4">
          <Filters
            config={filtersConfig}
            value={filters}
            onChange={(id, value) =>
              setFilters((prev) => ({ ...prev, [id]: value }))
            }
            onReset={() => setFilters(createInitialFiltersState())}
            onApply={applyFilters}
          />
          <GigCard users={filteredUsers} activeFilters={filters}/>
        </div>
      </section>
    </>
  );
}

export default BrowseGigs;
