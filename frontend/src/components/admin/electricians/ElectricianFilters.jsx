import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaUsers,
} from "react-icons/fa";

const ElectricianFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  filteredCount,
  totalCount,
}) => {
  const hasFilters =
    search.trim() !== "" || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 mb-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
              <FaUsers />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                All Electricians
              </h2>

              <p className="text-sm text-slate-500 mt-0.5">
                Showing {filteredCount} of {totalCount} electricians
              </p>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition"
          >
            <FaTimes />
            Clear Filters
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, mobile or service area..."
            className="w-full border border-slate-200 bg-slate-50 rounded-xl py-3.5 pl-11 pr-4 outline-none transition focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none border border-slate-200 bg-slate-50 rounded-xl py-3.5 pl-11 pr-10 outline-none cursor-pointer transition focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
          >
            <option value="all">
              All Status
            </option>

            <option value="available">
              Available
            </option>

            <option value="busy">
              Busy
            </option>

            <option value="off-duty">
              Off Duty
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ElectricianFilters;