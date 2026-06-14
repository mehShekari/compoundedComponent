const SingleSearch = () => (
  <div>
    <label htmlFor="page-single-search" className="sr-only">
      Search
    </label>
    <input
      id="page-single-search"
      type="search"
      placeholder="Search"
      aria-label="Search records"
    />
  </div>
);

SingleSearch.displayName = "header-singleSearch";
export default SingleSearch;
