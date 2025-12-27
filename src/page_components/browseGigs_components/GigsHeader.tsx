function GigsHeader() {
  return (
    <>
      <header className="flex justify-start flex-col gap-2 mx-6 mb-4 py-4 bg-(--color-bg)">
        <h1 className="text-4xl text-(--color-text) font-bold">Browse Gigs</h1>
        <span className="text-md text-(--color-text-muted) font-medium">
          Discover talented freelancers for your project
        </span>
      </header>
    </>
  );
}

export default GigsHeader;
