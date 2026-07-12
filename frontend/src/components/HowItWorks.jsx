import {
  FaClipboardList,
  FaCalendarCheck,
  FaUserCog,
  FaCheckCircle,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaClipboardList />,
    title: "Choose a Service",
    desc: "Select the electrical service you need.",
  },
  {
    icon: <FaCalendarCheck />,
    title: "Book Appointment",
    desc: "Choose your preferred date and time.",
  },
  {
    icon: <FaUserCog />,
    title: "Electrician Arrives",
    desc: "Our expert visits your location.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Job Completed",
    desc: "Safe, professional and guaranteed work.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-slate-900 text-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-yellow-400 uppercase font-semibold">
            Process
          </span>

          <h2 className="text-4xl font-bold mt-4">
            How Our Service Works
          </h2>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {steps.map((step, index) => (

            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-8 text-center hover:bg-yellow-400 hover:text-black transition"
            >

              <div className="text-5xl mb-6 flex justify-center">

                {step.icon}

              </div>

              <h3 className="text-2xl font-bold">

                {step.title}

              </h3>

              <p className="mt-4">

                {step.desc}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default HowItWorks;