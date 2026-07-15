import {
  FaLayerGroup,
  FaToggleOn,
  FaStar,
  FaExclamationTriangle,
} from "react-icons/fa";

const StatCard = ({ title, value, icon, iconClass }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-slate-500">{title}</p>
        <p className="text-3xl font-black text-slate-900 mt-2">
          {value}
        </p>
      </div>

      <div
        className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-xl ${iconClass}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const ServiceStats = ({ services }) => {
  const activeCount = services.filter((item) => item.isActive).length;
  const popularCount = services.filter((item) => item.isPopular).length;
  const emergencyCount = services.filter(
    (item) => item.isEmergency
  ).length;

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      <StatCard
        title="Total Services"
        value={services.length}
        icon={<FaLayerGroup />}
        iconClass="bg-blue-100 text-blue-600"
      />

      <StatCard
        title="Active Services"
        value={activeCount}
        icon={<FaToggleOn />}
        iconClass="bg-green-100 text-green-600"
      />

      <StatCard
        title="Popular Services"
        value={popularCount}
        icon={<FaStar />}
        iconClass="bg-purple-100 text-purple-600"
      />

      <StatCard
        title="Emergency"
        value={emergencyCount}
        icon={<FaExclamationTriangle />}
        iconClass="bg-red-100 text-red-600"
      />
    </div>
  );
};

export default ServiceStats;