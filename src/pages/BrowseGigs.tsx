import Filters from "./../page_components/browseGigs_components/Filters.tsx";
import Header from "./../page_components/browseGigs_components/GigsHeader.tsx";
import GigCard from "../page_components/browseGigs_components/GigCardContainer.tsx";
import { filtersConfig } from "../config/filters.config.ts";
import { useState, useEffect, useCallback } from "react";

import { fetchGigs } from "../API/gigs/getGigs.tsx";
import type { Gig, GigResponse, GigFilters } from "../API/gigs/getGigs.tsx";
import LoadingCircle from "../utils/loading.tsx";

function BrowseGigs() {
  const createInitialFiltersState = () => {
    return filtersConfig.reduce(
      (acc, filter) => {
        acc[filter.id] = filter.defaultValue;
        return acc;
      },
      {} as Record<string, any>,
    );
  };

  const [filters, setFilters] = useState(createInitialFiltersState);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const [loading, setLoading] = useState(false);
  const [Gigs, setGigs] = useState<Gig[]>([]);
  const [response, setResponse] = useState<GigResponse>();

  const buildApiFilters = useCallback((): GigFilters => {
    const apiFilters: GigFilters = { page: pageNumber };

    if (searchQuery.trim()) {
      apiFilters.search = searchQuery.trim();
    }

    // Category filter - match by name to find category_id
    if (filters.category) {
      // The backend supports category name search via the search param
      // or category_id. We'll pass category name as search if no other search is active
      apiFilters.search = apiFilters.search
        ? `${apiFilters.search}`
        : undefined;
      // We pass category name and let the backend handle it
      // The backend GigController filters by category_id, so we need to map names to IDs
      // For now, we include category in search
      if (!apiFilters.search) {
        apiFilters.search = filters.category;
      }
    }

    // Budget filter
    if (filters.budget) {
      const [min, max] = filters.budget;
      if (min > 0) apiFilters.min_price = min;
      if (max < 1000) apiFilters.max_price = max;
    }

    // Delivery time filter
    if (filters.deliveryTime && filters.deliveryTime !== "Anytime") {
      switch (filters.deliveryTime) {
        case "Express 24H":
          apiFilters.max_delivery_time = 1;
          break;
        case "Up to 3 days":
          apiFilters.max_delivery_time = 3;
          break;
        case "Up to 7 days":
          apiFilters.max_delivery_time = 7;
          break;
      }
    }

    // Sort
    if (sortBy) {
      switch (sortBy) {
        case "price_low":
          apiFilters.sort_by = "price";
          apiFilters.sort_order = "asc";
          break;
        case "price_high":
          apiFilters.sort_by = "price";
          apiFilters.sort_order = "desc";
          break;
        case "rating":
          apiFilters.sort_by = "rating";
          apiFilters.sort_order = "desc";
          break;
        case "newest":
          apiFilters.sort_by = "created_at";
          apiFilters.sort_order = "desc";
          break;
        case "popular":
          apiFilters.sort_by = "order_count";
          apiFilters.sort_order = "desc";
          break;
      }
    }

    return apiFilters;
  }, [pageNumber, searchQuery, filters, sortBy]);

  const loadGigs = useCallback(async () => {
    setLoading(true);
    try {
      const apiFilters = buildApiFilters();
      const response = await fetchGigs(apiFilters);
      if (response.success) {
        setGigs(response.data);
        setResponse(response);
      }
    } catch (error) {
      console.error("Error loading gigs:", error);
    } finally {
      setLoading(false);
    }
  }, [buildApiFilters]);

  useEffect(() => {
    loadGigs();
  }, [loadGigs]);

  const applyFilters = () => {
    setPageNumber(1);
    // loadGigs will be triggered by useEffect due to state change
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPageNumber(1);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    setPageNumber(1);
  };

  if (loading && Gigs.length === 0) {
    return <LoadingCircle size={14} />;
  }

  return (
    <>
      <section className="bg-(--color-bg) pb-4 px-5">
        <Header
          searchQuery={searchQuery}
          onSearch={handleSearch}
          sortBy={sortBy}
          onSort={handleSort}
        />
        <div className="flex flex-col justify-between gap-4">
          <Filters
            config={filtersConfig}
            value={filters}
            onChange={(id, value) =>
              setFilters((prev: Record<string, any>) => ({
                ...prev,
                [id]: value,
              }))
            }
            onReset={() => {
              setFilters(createInitialFiltersState());
              setSearchQuery("");
              setSortBy("");
              setPageNumber(1);
            }}
            onApply={applyFilters}
          />
          {loading && Gigs.length > 0 && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--color-primary)"></div>
            </div>
          )}
          {response && (
            <GigCard
              response={response}
              activeFilters={filters}
              onPageChange={setPageNumber}
              pageNumber={pageNumber}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default BrowseGigs;
