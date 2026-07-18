import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBolt, FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";

import { useUserAuth } from "../context/UserAuthContext";


const Navbar = () => {

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { user, logout } = useUserAuth();

  // console.log("Navbar user:", user); // Debugging line to check the user state



  const links = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Track Booking", path: "/track-booking" },
  ];



  const handleLogout = () => {

    logout();

    setOpen(false);

    navigate("/login");

  };



  return (

    <header className="sticky top-0 z-50 bg-slate-950 shadow-lg">


      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">


        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-2 text-yellow-400 text-2xl font-bold"
        >

          <FaBolt />

          ElectroFix

        </Link>




        {/* Desktop Links */}

        <nav className="hidden lg:flex gap-8">

          {
            links.map((link)=>(

              <NavLink
                key={link.path}
                to={link.path}
                className={({isActive}) =>
                  isActive
                  ? "text-yellow-400 font-semibold"
                  : "text-white hover:text-yellow-400 transition"
                }
              >

                {link.name}

              </NavLink>

            ))
          }

        </nav>





        {/* Desktop User Section */}

        <div className="hidden lg:flex items-center gap-4">

{
  user ? (
    <>
      {/* Profile */}
      <Link
        to="/profile"
        className="flex items-center gap-2 bg-slate-900 border border-yellow-400 text-white px-5 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition"
      >
        <FaUserCircle className="text-2xl" />
        <span>{user.fullName}</span>
      </Link>

      {/* Book Now */}
      <Link
        to="/booking"
        className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
      >
        Book Now
      </Link>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="border border-red-500 text-red-400 px-5 py-3 rounded-xl font-bold hover:bg-red-500 hover:text-white transition"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className="text-white hover:text-yellow-400 font-medium transition"
      >
        Login
      </Link>

      <Link
        to="/register"
        className="text-white hover:text-yellow-400 font-medium transition"
      >
        Register
      </Link>

      <Link
        to="/booking"
        className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold hover:bg-yellow-300 transition"
      >
        Book Now
      </Link>
    </>
  )
}


        </div>





        {/* Mobile Menu Button */}

        <button
          onClick={()=>setOpen(!open)}
          className="lg:hidden text-white text-3xl"
        >

          {
            open
            ? <HiX/>
            : <HiMenu/>
          }

        </button>


      </div>





      {/* Mobile Menu */}

      {
        open && (

          <div className="lg:hidden bg-slate-900 px-6 py-6 space-y-5">


            {
              links.map((link)=>(

                <NavLink

                  key={link.path}

                  to={link.path}

                  onClick={()=>setOpen(false)}

                  className="block text-white hover:text-yellow-400"

                >

                  {link.name}

                </NavLink>

              ))
            }





            {
              user ? (

                <>

                  <div className="text-yellow-400 font-bold flex items-center gap-2">

                    <FaUserCircle/>

                    {user.fullName}

                  </div>



                  <Link

                    to="/booking"

                    onClick={()=>setOpen(false)}

                    className="block bg-yellow-400 text-black text-center py-3 rounded-xl font-bold"

                  >

                    Book Now

                  </Link>



                  <button

                    onClick={handleLogout}

                    className="w-full bg-red-500 text-white py-3 rounded-xl font-bold"

                  >

                    Logout

                  </button>


                </>


              ) : (

                <>

                  <Link
                    to="/login"
                    onClick={()=>setOpen(false)}
                    className="block text-white"
                  >
                    Login
                  </Link>


                  <Link
                    to="/register"
                    onClick={()=>setOpen(false)}
                    className="block text-white"
                  >
                    Register
                  </Link>


                  <Link
                    to="/booking"
                    onClick={()=>setOpen(false)}
                    className="block bg-yellow-400 text-black text-center py-3 rounded-xl font-bold"
                  >
                    Book Now
                  </Link>


                </>

              )

            }


          </div>

        )
      }


    </header>

  );

};


export default Navbar;