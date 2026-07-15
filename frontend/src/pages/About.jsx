import {
  FaBolt,
  FaShieldAlt,
  FaClock,
  FaTools,
  FaCheckCircle,
  FaPhoneAlt,
} from "react-icons/fa";

const About = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Safe & Reliable",
      description:
        "We follow professional safety standards to provide reliable electrical solutions.",
    },
    {
      icon: <FaClock />,
      title: "Fast Response",
      description:
        "Our team responds quickly and works efficiently to solve your electrical problems.",
    },
    {
      icon: <FaTools />,
      title: "Skilled Electricians",
      description:
        "Experienced professionals equipped to handle residential and commercial electrical work.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-950 py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-full mb-6">
            <FaBolt />
            <span className="font-semibold">About Our Company</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Powering Homes & Businesses
            <span className="text-yellow-400"> Safely</span>
          </h1>

          <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed">
            We provide professional electrical services with a focus on safety,
            quality, and customer satisfaction.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <span className="text-yellow-500 font-bold uppercase tracking-wider">
              Who We Are
            </span>

            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3 mb-6">
              Your Trusted Electrical
              <span className="text-yellow-500"> Service Partner</span>
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              We are committed to providing dependable electrical services for
              homes and businesses. From small electrical repairs to complete
              installations, our goal is to deliver safe and long-lasting
              solutions.
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              Our experienced electricians use modern tools and professional
              techniques to diagnose problems and complete every job with care
              and attention to detail.
            </p>

            <div className="space-y-4">
              {[
                "Professional electrical solutions",
                "Safety-focused work",
                "Transparent and reliable service",
                "Residential & commercial support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <FaCheckCircle className="text-yellow-500 text-xl" />
                  <span className="font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card */}
          <div className="relative">
            <div className="bg-slate-950 rounded-3xl p-10 md:p-14 text-white shadow-2xl">
              <div className="w-16 h-16 bg-yellow-400 text-slate-950 rounded-2xl flex items-center justify-center text-3xl mb-8">
                <FaBolt />
              </div>

              <h3 className="text-3xl font-bold mb-5">
                Quality Work You Can Trust
              </h3>

              <p className="text-gray-300 leading-relaxed mb-8">
                Electrical work requires experience, precision, and safety.
                That's why we focus on delivering professional service from the
                first inspection to the final completion.
              </p>

              <div className="border-t border-slate-700 pt-7">
                <p className="text-yellow-400 font-bold text-lg">
                  Reliable. Professional. Safe.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-yellow-400 rounded-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-yellow-500 font-bold uppercase tracking-wider">
              Why Choose Us
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
              Electrical Services You Can Depend On
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-yellow-400 text-slate-950 rounded-xl flex items-center justify-center text-2xl mb-6">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-yellow-400 rounded-3xl p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-950 mb-3">
                Need Professional Electrical Help?
              </h2>

              <p className="text-slate-800 text-lg">
                Book a service and let our professionals handle your electrical
                needs.
              </p>
            </div>

            <a
              href="/booking"
              className="flex items-center gap-3 bg-slate-950 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition whitespace-nowrap"
            >
              <FaPhoneAlt />
              Book a Service
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;