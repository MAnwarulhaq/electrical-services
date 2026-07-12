import { FaUsers, FaTools, FaStar, FaBolt } from "react-icons/fa";

const stats = [
  {
    icon: <FaUsers />,
    number: "2500+",
    title: "Happy Customers",
  },
  {
    icon: <FaTools />,
    number: "5000+",
    title: "Projects Completed",
  },
  {
    icon: <FaStar />,
    number: "10+",
    title: "Years Experience",
  },
  {
    icon: <FaBolt />,
    number: "24/7",
    title: "Emergency Service",
  },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-yellow-400">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="text-5xl text-yellow-500 flex justify-center mb-4">
                {item.icon}
              </div>

              <h2 className="text-4xl font-bold">
                {item.number}
              </h2>

              <p className="text-gray-600 mt-2">
                {item.title}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default StatsSection;