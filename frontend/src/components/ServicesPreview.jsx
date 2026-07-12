import { Link } from "react-router-dom";
import {
  FaBolt,
  FaLightbulb,
  FaTools,
  FaSolarPanel,
  FaFan,
  FaVideo,
} from "react-icons/fa";

const services = [
  {
    icon: <FaBolt />,
    title: "House Wiring",
    desc: "Complete home wiring and rewiring solutions.",
  },
  {
    icon: <FaLightbulb />,
    title: "Lighting Installation",
    desc: "LED lights, decorative lighting and repairs.",
  },
  {
    icon: <FaFan />,
    title: "Fan Installation",
    desc: "Ceiling fan installation and maintenance.",
  },
  {
    icon: <FaTools />,
    title: "Electrical Repair",
    desc: "Switches, sockets and fault finding.",
  },
  {
    icon: <FaSolarPanel />,
    title: "Solar Installation",
    desc: "Residential and commercial solar systems.",
  },
  {
    icon: <FaVideo />,
    title: "CCTV Installation",
    desc: "Professional CCTV installation services.",
  },
];

const ServicesPreview = () => {
  return (
    <section className="py-24 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <p className="text-yellow-500 font-semibold uppercase">
            Our Services
          </p>

          <h2 className="text-4xl font-bold mt-3">
            Professional Electrical Solutions
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
            We provide reliable electrical services for homes,
            offices and commercial buildings across Karachi.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {services.map((service, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >

              <div className="w-16 h-16 rounded-full bg-yellow-400 text-black flex items-center justify-center text-3xl mb-6">

                {service.icon}

              </div>

              <h3 className="text-2xl font-bold">

                {service.title}

              </h3>

              <p className="text-gray-500 mt-4">

                {service.desc}

              </p>

              <Link
                to="/booking"
                className="inline-block mt-8 text-yellow-500 font-semibold hover:text-yellow-600"
              >
                Book Service →
              </Link>

            </div>

          ))}

        </div>

        <div className="text-center mt-14">

          <Link
            to="/services"
            className="bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-black transition"
          >
            View All Services
          </Link>

        </div>

      </div>

    </section>
  );
};

export default ServicesPreview;