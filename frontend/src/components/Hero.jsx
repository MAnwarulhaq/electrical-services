import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBolt } from "react-icons/fa";
import { MdElectricalServices } from "react-icons/md";
import { motion } from "framer-motion";

import { getSettings } from "../services/settingsApi";

const Hero = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await getSettings();

      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="bg-slate-950 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT */}

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .8 }}
        >

          <span className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full">
            <FaBolt />
            Professional Electrical Services
          </span>

          <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mt-8">
            Reliable Electrical Services

            <span className="text-yellow-400 block">
              In Karachi
            </span>
          </h1>

          <p className="text-gray-300 text-lg mt-8 leading-8">
            Safe, Fast and Affordable Electrical Solutions
            for Homes, Offices and Commercial Buildings.
            Available Across Karachi.
          </p>

          <div className="flex gap-5 mt-10 flex-wrap">

            <Link
              to="/booking"
              className="bg-yellow-400 px-8 py-4 rounded-xl font-bold hover:scale-105 transition"
            >
              Book Electrician
            </Link>

            <a
              href={`tel:${settings?.companyPhone || "+923001234567"}`}
              className="border border-yellow-400 text-yellow-400 px-8 py-4 rounded-xl hover:bg-yellow-400 hover:text-black transition"
            >
              Call Now
            </a>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14">

            <div>

              <h2 className="text-yellow-400 text-3xl font-bold">

                {settings?.stats?.yearsOfExperience || 0}+

              </h2>

              <p className="text-gray-400">

                Years Experience

              </p>

            </div>

            <div>

              <h2 className="text-yellow-400 text-3xl font-bold">

                {settings?.stats?.happyCustomers || 0}+

              </h2>

              <p className="text-gray-400">

                Happy Customers

              </p>

            </div>

            <div>

              <h2 className="text-yellow-400 text-3xl font-bold">

                {settings?.stats?.completedJobs || 0}+

              </h2>

              <p className="text-gray-400">

                Completed Jobs

              </p>

            </div>

            <div>

              <h2 className="text-yellow-400 text-3xl font-bold">

                {settings?.stats?.areasCovered || 0}+

              </h2>

              <p className="text-gray-400">

                Areas Covered

              </p>

            </div>

          </div>

        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .8 }}
          className="relative"
        >

          <div className="bg-yellow-400 rounded-full w-[500px] h-[500px] absolute blur-3xl opacity-20"></div>

          <img
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80"
            alt="Electrician"
            className="relative rounded-3xl shadow-2xl"
          />

          <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">

            <MdElectricalServices className="text-yellow-500 text-5xl"/>

            <div>

              <h3 className="font-bold">

                Certified Electricians

              </h3>

              <p className="text-gray-500">

                Fast & Reliable Service

              </p>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;