import Filters from "./../page_components/browseGigs_components/Filters.tsx";
import Header from "./../page_components/browseGigs_components/GigsHeader.tsx";
import GigCard from "../page_components/browseGigs_components/GigCardContainer.tsx";
import { filtersConfig } from "../config/filters.config.ts";
import { useState, useEffect} from "react";
// import { filterUser } from "../services/filterUsers.ts";

import { fetchGigs } from "../API/gigs/getGigs.tsx";
import type { Gig } from "../API/gigs/getGigs.tsx";
import LoadingCircle from "../utils/loading.tsx";







function BrowseGigs() {
  const createInitialFiltersState = () => {
    return filtersConfig.reduce((acc, filter) => {
      acc[filter.id] = filter.defaultValue;
      return acc;
    }, {} as Record<string, any>);
  };

  const [filters, setFilters] = useState(createInitialFiltersState);
  const [filteredUsers, setFilteredUsers] = useState<Gig[]>([]);

  const applyFilters = () => {
    // const result = filterUser(users, filters);
    // setFilteredUsers(result);
  };

const [loading, setLoading] = useState(false);
const [Gigs, setGigs] = useState<Gig[]>([]); 

useEffect(() => {
  const loadGigs = async () => {
    setLoading(true);
    console.log("Fetching gigs...");
    const response = await fetchGigs();

    if (response.success) {
      setGigs(response.data);
    }
    setLoading(false);
  };
  loadGigs();
}, []);

useEffect(() => {
  console.log("State updated:", Gigs);
}, [Gigs]);

  
  if (loading || Gigs.length === 0) {
    return <LoadingCircle size={14} />;
  }



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
          <GigCard users={Gigs} activeFilters={filters}/>
        </div>
      </section>
    </>
  );
}

export default BrowseGigs;
