import { FaSearch } from "react-icons/fa";

const ServiceFilters = ({
  search,
  setSearch,
  filterCategory,
  setFilterCategory,
  filteredCount,
  totalCount,
}) => {
  const hasFilters = search || filterCategory !== "all";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            All Services
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredCount} of {totalCount} services shown
          </p>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFilterCategory("all");
            }}
            className="text-sm font-bold text-red-500 hover:text-red-600"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search service name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-3.5 outline-none bg-white focus:border-yellow-400"
        >
          <option value="all">All Categories</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
    </div>
  );
};

export default ServiceFilters;