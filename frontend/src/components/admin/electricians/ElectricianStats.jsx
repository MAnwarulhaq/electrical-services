import {
  FaBolt,
  FaUserCheck,
  FaUserClock,
  FaUserSlash,
} from "react-icons/fa";

const StatCard = ({
  title,
  value,
  icon,
  iconClass,
  description,
}) => {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Decorative Circle */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-slate-50 rounded-full transition-transform duration-300 group-hover:scale-125" />

      <div className="relative flex items-center justify-between gap-4">
        {/* Content */}
        <div>
          <p className="text-sm font-bold text-slate-500">
            {title}
          </p>

          <p className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
            {value}
          </p>

          <p className="text-xs text-slate-400 mt-2">
            {description}
          </p>
        </div>

        {/* Icon */}
        <div
          className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const ElectricianStats = ({ stats }) => {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      <StatCard
        title="Total Electricians"
        value={stats.total}
        description="All registered electricians"
        icon={<FaBolt />}
        iconClass="bg-slate-950 text-yellow-400"
      />

      <StatCard
        title="Available"
        value={stats.available}
        description="Ready for new bookings"
        icon={<FaUserCheck />}
        iconClass="bg-green-100 text-green-600"
      />

      <StatCard
        title="Busy"
        value={stats.busy}
        description="Currently assigned to work"
        icon={<FaUserClock />}
        iconClass="bg-orange-100 text-orange-600"
      />

      <StatCard
        title="Off Duty"
        value={stats.offDuty}
        description="Currently unavailable"
        icon={<FaUserSlash />}
        iconClass="bg-red-100 text-red-600"
      />
    </div>
  );
};

export default ElectricianStats;