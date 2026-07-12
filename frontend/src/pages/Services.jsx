import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices } from "../services/serviceApi";

const Services = () => {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadServices();

  }, []);

  const loadServices = async () => {

    try {

      const data = await getServices();

      setServices(data.services || data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="py-40 text-center text-3xl">

        Loading Services...

      </div>

    );

  }

  return (

    <section className="py-20 bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h1 className="text-5xl font-bold">

            Our Electrical Services

          </h1>

          <p className="text-gray-500 mt-4">

            Professional Electrical Solutions Across Karachi

          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {services.map((service) => (

            <ServiceCard

              key={service._id}

              service={service}

            />

          ))}

        </div>

      </div>

    </section>

  );

};

export default Services;