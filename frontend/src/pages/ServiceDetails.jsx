import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBolt,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

import { getServiceBySlug } from "../services/serviceApi";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

const ServiceDetails = () => {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getServiceBySlug(slug);

        setService(response.data);
      } catch (err) {
        console.error("Service Details API Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load service details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchService();
    }
  }, [slug]);

  const getImageUrl = (image) => {
    if (!image) {
      return "https://placehold.co/1200x700?text=Electrical+Service";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${SERVER_URL}${image}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <FaBolt className="text-yellow-400 text-6xl animate-bounce mx-auto" />

          <h2 className="text-white text-2xl font-bold mt-6">
            Loading Service...
          </h2>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FaBolt className="text-red-500 text-3xl" />
          </div>

          <h1 className="text-4xl font-black mt-6">
            Service Not Found
          </h1>

          <p className="text-gray-500 mt-4">
            {error || "The requested service does not exist."}
          </p>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-yellow-400 px-7 py-4 rounded-xl font-bold mt-8"
          >
            <FaArrowLeft />
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-slate-950 pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition"
          >
            <FaArrowLeft />
            Back to Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center mt-10">
            {/* Content */}
            <div>
              <div className="flex flex-wrap gap-3">
                {service.category && (
                  <span className="bg-white/10 text-yellow-400 border border-yellow-400/30 px-4 py-2 rounded-full text-sm font-bold capitalize">
                    {service.category}
                  </span>
                )}

                {service.isPopular && (
                  <span className="bg-yellow-400 text-slate-950 px-4 py-2 rounded-full text-sm font-bold">
                    Popular
                  </span>
                )}

                {service.isEmergency && (
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    24/7 Emergency
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mt-6">
                {service.name}
              </h1>

              <p className="text-gray-300 text-lg leading-8 mt-6">
                {service.shortDescription}
              </p>

              <div className="flex flex-wrap gap-6 mt-8">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-11 h-11 bg-yellow-400/10 rounded-xl flex items-center justify-center">
                    <FaClock className="text-yellow-400" />
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">
                      Estimated Time
                    </p>

                    <p className="font-bold">
                      {service.estimatedTime}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Starting From
                  </p>

                  <p className="text-yellow-400 text-3xl font-black">
                    Rs.{" "}
                    {Number(
                      service.startingPrice || 0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-10">
                <Link
                  to={`/booking?service=${service._id}`}
                  className="bg-yellow-400 text-slate-950 px-8 py-4 rounded-xl font-black hover:bg-yellow-300 transition"
                >
                  Book This Service
                </Link>

                <a
                  href="tel:+923001234567"
                  className="inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-slate-950 transition"
                >
                  <FaPhoneAlt />
                  Call Now
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src={getImageUrl(service.image)}
                alt={service.name}
                className="w-full h-[350px] md:h-[500px] object-cover rounded-3xl shadow-2xl"
              />

              {service.isEmergency && (
                <div className="absolute bottom-5 left-5 right-5 bg-red-500 text-white rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-3">
                    <FaBolt className="text-2xl" />

                    <div>
                      <p className="font-black">
                        Emergency Service Available
                      </p>

                      <p className="text-sm text-red-100">
                        Fast response for urgent electrical problems.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black">
              About This Service
            </h2>

            <p className="text-gray-600 leading-8 mt-6 whitespace-pre-line">
              {service.fullDescription}
            </p>

            {/* What's Included */}
            {service.whatsIncluded?.length > 0 && (
              <div className="mt-14">
                <h2 className="text-3xl font-black">
                  What's Included
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mt-7">
                  {service.whatsIncluded.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-start gap-3 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm"
                    >
                      <FaCheckCircle className="text-green-500 text-xl mt-0.5 shrink-0" />

                      <span className="text-gray-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Areas */}
            {service.availableAreas?.length > 0 && (
              <div className="mt-14">
                <h2 className="text-3xl font-black">
                  Available Service Areas
                </h2>

                <p className="text-gray-500 mt-3">
                  This service is currently available in these areas.
                </p>

                <div className="flex flex-wrap gap-3 mt-7">
                  {service.availableAreas.map((area) => (
                    <div
                      key={area._id}
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-xl"
                    >
                      <FaMapMarkerAlt className="text-yellow-500" />
                      {area.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STICKY BOOKING CARD */}
          <aside>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:sticky lg:top-28">
              <p className="text-gray-500">
                Service starting from
              </p>

              <h2 className="text-4xl font-black mt-2">
                Rs.{" "}
                {Number(
                  service.startingPrice || 0
                ).toLocaleString()}
              </h2>

              <div className="border-t border-gray-200 my-7" />

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <FaClock className="text-yellow-500 text-xl" />

                  <div>
                    <p className="text-sm text-gray-500">
                      Estimated Time
                    </p>

                    <p className="font-bold">
                      {service.estimatedTime}
                    </p>
                  </div>
                </div>

                {service.category && (
                  <div className="flex items-center gap-4">
                    <FaBolt className="text-yellow-500 text-xl" />

                    <div>
                      <p className="text-sm text-gray-500">
                        Category
                      </p>

                      <p className="font-bold capitalize">
                        {service.category}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to={`/booking?service=${service._id}`}
                className="block text-center bg-yellow-400 text-slate-950 font-black py-4 rounded-xl mt-8 hover:bg-yellow-300 transition"
              >
                Book This Service
              </Link>

              <Link
                to="/services"
                className="block text-center border-2 border-slate-950 font-bold py-4 rounded-xl mt-4 hover:bg-slate-950 hover:text-white transition"
              >
                View Other Services
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetails;