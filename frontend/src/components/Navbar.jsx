import { Link, NavLink } from "react-router-dom";
import { FaBolt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";

const Navbar = () => {

  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Track Booking", path: "/track-booking" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950 shadow-lg">

      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

        <Link
          to="/"
          className="flex items-center gap-2 text-yellow-400 text-2xl font-bold"
        >
          <FaBolt />
          ElectroFix
        </Link>

        <nav className="hidden lg:flex gap-8">

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-semibold"
                  : "text-white hover:text-yellow-400 transition"
              }
            >
              {link.name}
            </NavLink>
          ))}

        </nav>

        <Link
          to="/booking"
          className="hidden lg:block bg-yellow-400 px-5 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
        >
          Book Now
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white text-3xl"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>

      </div>

      {open && (

        <div className="bg-slate-900 flex flex-col p-5 gap-5 lg:hidden">

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className="text-white hover:text-yellow-400"
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/booking"
            className="bg-yellow-400 text-center rounded-lg py-3 font-semibold"
          >
            Book Now
          </Link>

        </div>

      )}

    </header>
  );
};

export default Navbar;