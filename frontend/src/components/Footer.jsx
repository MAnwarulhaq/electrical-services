import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {

  return (

    <footer className="bg-slate-950 text-gray-300 mt-20">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

        <div>

          <h2 className="text-3xl font-bold text-yellow-400">
            ElectroFix
          </h2>

          <p className="mt-4 leading-7">
            Professional Electrical Services in Karachi.
            Fast, Safe & Affordable Solutions.
          </p>

        </div>

        <div>

          <h3 className="text-xl text-white font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-3">

            <li>Home</li>
            <li>Services</li>
            <li>About</li>
            <li>Contact</li>

          </ul>

        </div>

        <div>

          <h3 className="text-xl text-white font-semibold mb-4">
            Contact
          </h3>

          <p>Karachi, Pakistan</p>

          <p className="mt-2">
            +92 300 1234567
          </p>

          <p className="mt-2">
            info@electrofix.pk
          </p>

          <div className="flex gap-5 mt-5 text-2xl">

            <FaFacebook />

            <FaInstagram />

            <FaWhatsapp />

          </div>

        </div>

      </div>

      <div className="border-t border-slate-700 py-6 text-center">

        © 2026 ElectroFix. All Rights Reserved.

      </div>

    </footer>

  );

};

export default Footer;