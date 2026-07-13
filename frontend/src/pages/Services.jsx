import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBolt,
  FaClock,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";

import { getServices } from "../services/serviceApi";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

const Services = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getServices();
        setServices(response.data || []);
      } catch (err) {
        console.error("Services API Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load services. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = useMemo(() => {
    const values = services
      .map((service) => service.category)
      .filter(Boolean);

    return ["all", ...new Set(values)];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch =
        service.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        service.shortDescription
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" ||
        service.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  const getImageUrl = (image) => {
    if (!image) {
      return "https://placehold.co/700x450?text=Electrical+Service";
    }

    if (image.startsWith("http")) return image;

    return `${SERVER_URL}${image}`;
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-950 pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-widest">
            <FaBolt />
            Our Services
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-white mt-5">
            Professional Electrical
            <span className="text-yellow-400"> Services</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-lg mt-6">
            Reliable electrical solutions for homes,
            businesses and emergency requirements.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        {/* Search */}
        <div className="max-w-2xl mx-auto relative">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-14 pr-5 shadow-sm outline-none focus:border-yellow-400"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-5 py-3 rounded-xl font-semibold capitalize transition ${
                category === item
                  ? "bg-yellow-400 text-slate-950"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-24">
            <FaBolt className="text-5xl text-yellow-400 animate-bounce mx-auto" />

            <p className="text-gray-500 mt-5">
              Loading services...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 text-red-600 text-center p-6 rounded-2xl mt-14">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredServices.length === 0 && (
            <div className="text-center py-24">
              <h2 className="text-2xl font-bold">
                No services found
              </h2>

              <p className="text-gray-500 mt-3">
                Try another search or category.
              </p>
            </div>
          )}

        {/* Services */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
            {filteredServices.map((service) => (
              <article
                key={service._id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getImageUrl(service.image)}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  {service.isPopular && (
                    <span className="absolute top-4 left-4 bg-yellow-400 px-4 py-2 rounded-full text-sm font-bold">
                      Popular
                    </span>
                  )}

                  {service.isEmergency && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Emergency
                    </span>
                  )}
                </div>

                <div className="p-7">
                  <p className="text-yellow-600 font-semibold capitalize">
                    {service.category ||
                      "Electrical Service"}
                  </p>

                  <h2 className="text-2xl font-black text-slate-900 mt-2">
                    {service.name}
                  </h2>

                  <p className="text-gray-500 mt-4 line-clamp-3">
                    {service.shortDescription}
                  </p>

                  <div className="flex items-center gap-2 text-gray-500 mt-5">
                    <FaClock className="text-yellow-500" />
                    {service.estimatedTime}
                  </div>

                  <div className="flex items-end justify-between gap-4 mt-7">
                    <div>
                      <p className="text-sm text-gray-500">
                        Starting from
                      </p>

                      <p className="text-2xl font-black">
                        Rs.{" "}
                        {Number(
                          service.startingPrice || 0
                        ).toLocaleString()}
                      </p>
                    </div>

                    <Link
                      to={`/services/${service.slug}`}
                      className="flex items-center gap-2 bg-slate-950 text-white px-5 py-3 rounded-xl hover:bg-yellow-400 hover:text-slate-950 transition"
                    >
                      Details
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Services;