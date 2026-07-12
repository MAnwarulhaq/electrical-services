import {
  FaUserShield,
  FaClock,
  FaTools,
  FaMoneyBillWave,
  FaCheckCircle,
  FaHeadset,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUserShield />,
    title: "Certified Electricians",
    desc: "Experienced and trained professionals for every job.",
  },
  {
    icon: <FaClock />,
    title: "24/7 Emergency Service",
    desc: "Available day and night for urgent electrical issues.",
  },
  {
    icon: <FaTools />,
    title: "Modern Equipment",
    desc: "Latest tools for safe and accurate electrical work.",
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Affordable Pricing",
    desc: "Transparent pricing with no hidden charges.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Quality Guaranteed",
    desc: "Every project completed with high quality standards.",
  },
  {
    icon: <FaHeadset />,
    title: "Customer Support",
    desc: "Friendly support before and after service.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-yellow-500 font-semibold uppercase">
            Why Choose Us
          </span>

          <h2 className="text-4xl font-bold mt-4">
            We Deliver Safe & Reliable Electrical Solutions
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
            Our experienced electricians ensure quality work,
            affordable prices and complete customer satisfaction.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((item, index) => (

            <div
              key={index}
              className="rounded-2xl border p-8 hover:border-yellow-400 hover:shadow-xl transition duration-300"
            >

              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl mb-6">

                {item.icon}

              </div>

              <h3 className="text-2xl font-bold">

                {item.title}

              </h3>

              <p className="text-gray-500 mt-4 leading-7">

                {item.desc}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default WhyChooseUs;