import { Link } from "react-router-dom";

const EmergencyCTA = () => {
  return (
    <section className="bg-slate-950 py-24">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-5xl font-bold text-white">

          Need Emergency Electrical Service?

        </h2>

        <p className="text-gray-300 mt-6 text-lg">

          Our expert electricians are available 24/7 across Karachi.

        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-10">

          <Link
            to="/booking"
            className="bg-yellow-400 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition"
          >
            Book Now
          </Link>

          <a
            href="tel:+923001234567"
            className="border border-yellow-400 text-yellow-400 px-8 py-4 rounded-xl hover:bg-yellow-400 hover:text-black transition"
          >
            Call Now
          </a>

        </div>

      </div>

    </section>
  );
};

export default EmergencyCTA;
