
import { useState } from "react";
import {
  FaBolt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPaperPlane,
} from "react-icons/fa";

import { sendContactMessage } from "../services/contactApi";

const initialForm = {
  fullName: "",
  mobileNumber: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await sendContactMessage(formData);

      setSuccess(
        response.message ||
          "Your message has been sent successfully!"
      );

      setFormData(initialForm);
    } catch (err) {
      console.error("Contact API Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-slate-950 pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-widest">
            <FaBolt />
            Contact Us
          </span>

          <h1 className="text-4xl md:text-6xl text-white font-black mt-5">
            How Can We Help?
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-lg mt-6">
            Have a question or need electrical assistance?
            Send us a message and our team will get back to you.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[400px_1fr] gap-10">

          {/* CONTACT INFO */}
          <div className="space-y-5">
            <InfoCard
              icon={<FaPhoneAlt />}
              title="Call Us"
              value="+92 300 1234567"
            />

            <InfoCard
              icon={<FaEnvelope />}
              title="Email Us"
              value="info@electricalservices.pk"
            />

            <InfoCard
              icon={<FaMapMarkerAlt />}
              title="Service Area"
              value="Karachi, Pakistan"
            />

            {/* EMERGENCY CARD */}
            <div className="bg-slate-950 text-white rounded-3xl p-8 mt-6">
              <FaBolt className="text-yellow-400 text-4xl" />

              <h2 className="text-2xl font-black mt-5">
                Emergency Service
              </h2>

              <p className="text-gray-400 mt-3">
                Need urgent electrical assistance? Contact our
                emergency support team.
              </p>

              <a
                href="tel:+923001234567"
                className="block text-center bg-yellow-400 text-slate-950 font-black py-4 rounded-xl mt-7 hover:bg-yellow-300 transition"
              >
                Call Now
              </a>
            </div>
          </div>

          {/* CONTACT FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl p-6 md:p-10"
          >
            <h2 className="text-3xl font-black">
              Send Us a Message
            </h2>

            <p className="text-gray-500 mt-3 mb-8">
              Fill in the form below and we'll contact you soon.
            </p>

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 p-5 rounded-xl mb-7">
                <FaCheckCircle className="text-xl mt-0.5 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-5 rounded-xl mb-7">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">

              {/* FULL NAME */}
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              {/* MOBILE NUMBER */}
              <Input
                label="Mobile Number"
                name="mobileNumber"
                type="tel"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="03XX XXXXXXX"
                required
              />

              {/* EMAIL */}
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Optional"
              />

              {/* SUBJECT */}
              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                required
              />
            </div>

            {/* MESSAGE */}
            <div className="mt-6">
              <label
                htmlFor="message"
                className="font-bold"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="How can we help you?"
                className="w-full mt-2 border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-yellow-400 resize-none"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 bg-yellow-400 text-slate-950 font-black text-lg py-5 rounded-xl mt-8 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FaPaperPlane />

              {submitting
                ? "Sending Message..."
                : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

/* INPUT COMPONENT */
const Input = ({ label, name, ...props }) => (
  <div>
    <label
      htmlFor={name}
      className="font-bold"
    >
      {label}
    </label>

    <input
      id={name}
      name={name}
      {...props}
      className="w-full mt-2 border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-yellow-400"
    />
  </div>
);

/* INFO CARD COMPONENT */
const InfoCard = ({ icon, title, value }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-5">
    <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center text-xl shrink-0">
      {icon}
    </div>

    <div>
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <p className="font-black mt-1">
        {value}
      </p>
    </div>
  </div>
);

export default Contact;

