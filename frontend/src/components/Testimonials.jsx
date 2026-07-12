const testimonials = [
  {
    name: "Ali Khan",
    area: "DHA Karachi",
    review:
      "Excellent service. Electrician arrived on time and fixed everything professionally.",
  },
  {
    name: "Ahmed Raza",
    area: "Gulshan-e-Iqbal",
    review:
      "Affordable pricing and very professional team. Highly recommended.",
  },
  {
    name: "Muhammad Bilal",
    area: "North Nazimabad",
    review:
      "Quick emergency response. Great experience.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <span className="text-yellow-500 font-semibold">
            Testimonials
          </span>

          <h2 className="text-4xl font-bold mt-3">
            What Our Customers Say
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((item, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8"
            >

              <p className="text-gray-600 italic">
                "{item.review}"
              </p>

              <h3 className="mt-8 font-bold text-xl">
                {item.name}
              </h3>

              <span className="text-yellow-500">
                {item.area}
              </span>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
