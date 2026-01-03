import Filters from "./../page_components/browseGigs_components/Filters.tsx";
import Header from "./../page_components/browseGigs_components/GigsHeader.tsx";
import GigCard from "../page_components/browseGigs_components/GigCardContainer.tsx";
function BrowseGigs() {
  return (
    <>
      <section className="bg-(--color-bg) pb-4 px-5">
        <Header />
        <div className="flex flex-col justify-between gap-4">
          <Filters />
          <GigCard />
        </div>
      </section>
    </>
  );
}

export default BrowseGigs;
