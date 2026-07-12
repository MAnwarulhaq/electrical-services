import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300">

      <img
        src={service.image || "https://placehold.co/600x400"}
        alt={service.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-6">

        <h3 className="text-2xl font-bold">
          {service.name}
        </h3>

        <p className="text-gray-600 mt-4 line-clamp-3">
          {service.description}
        </p>

        <div className="flex justify-between items-center mt-6">

          <span className="text-yellow-500 font-bold text-xl">
            Rs. {service.startingPrice}
          </span>

          <Link
            to={`/services/${service.slug}`}
            className="flex items-center gap-2 text-slate-900 font-semibold hover:text-yellow-500"
          >
            Details
            <FaArrowRight />
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ServiceCard;