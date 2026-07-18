import {
  FaUserPlus,
  FaSearch,
  FaUsers,
} from "react-icons/fa";

const ElectricianEmptyState = ({
  hasFilters,
  onAdd,
  onClearFilters,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl py-16 px-6 text-center shadow-sm">
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto">
        {hasFilters ? (
          <FaSearch className="text-3xl text-slate-400" />
        ) : (
          <FaUsers className="text-3xl text-slate-400" />
        )}
      </div>

      <h2 className="text-2xl font-black text-slate-900 mt-6">
        {hasFilters
          ? "No Electricians Found"
          : "No Electricians Yet"}
      </h2>

      <p className="text-slate-500 max-w-md mx-auto mt-3 leading-relaxed">
        {hasFilters
          ? "No electrician matches your current search or status filter."
          : "Start building your team by adding your first electrician."}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
        {hasFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-black transition"
          >
            Clear Filters
          </button>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-6 py-3 rounded-xl font-black transition"
          >
            <FaUserPlus />
            Add Electrician
          </button>
        )}
      </div>
    </div>
  );
};

export default ElectricianEmptyState;