import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaBolt,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { getServices } from "../services/serviceApi";
import { getServiceAreas } from "../services/serviceAreaApi";
import { createBooking } from "../services/bookingApi";
import { getUserProfile } from "../services/userApi";


const initialForm = {
  fullName: "",
  mobileNumber: "",
  whatsappNumber: "",
  email: "",
  address: "",
  area: "",
  service: "",
  preferredDate: "",
  preferredTime: "",
  problemDescription: "",
  serviceType: "normal",
};



const Booking = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const serviceId = searchParams.get("service");


  const [formData, setFormData] = useState({
    ...initialForm,
    service: serviceId || "",
  });


  const [services, setServices] = useState([]);

  const [areas, setAreas] = useState([]);


  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);


  const [booking, setBooking] = useState(null);

  const [error, setError] = useState("");



  const token = localStorage.getItem("userToken");



  // LOGIN CHECK

  useEffect(() => {

    if (!token) {
      navigate("/login");
    }

  }, [token, navigate]);




  // LOAD DATA

  useEffect(() => {

    loadData();

  }, []);



  const loadData = async () => {

    try {

      setLoading(true);


      const [
        servicesRes,
        areasRes,
        profileRes

      ] = await Promise.all([

        getServices(),

        getServiceAreas(),

        getUserProfile()

      ]);



      setServices(
        servicesRes.data || []
      );


      setAreas(
        areasRes.data || []
      );



      if (profileRes.data.success) {

        const user =
          profileRes.data.data;


        setFormData(prev => ({

          ...prev,

          fullName:
            user.fullName || "",


          mobileNumber:
            user.mobileNumber || "",


          whatsappNumber:
            user.mobileNumber || "",


          email:
            user.email || "",


          address:
            user.address || "",

        }));

      }



    } catch (err) {

      console.log(err);


      setError(
        err.response?.data?.message ||
        "Unable to load booking page."
      );


    } finally {

      setLoading(false);

    }

  };





  // SERVICE FROM URL

  useEffect(() => {

    if (serviceId) {

      setFormData(prev => ({

        ...prev,

        service: serviceId

      }));

    }


  }, [serviceId]);





  // INPUT CHANGE

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;



    setFormData(prev => ({

      ...prev,

      [name]: value

    }));

  };





  // SUBMIT BOOKING

  const handleSubmit = async (e) => {

    e.preventDefault();


    try {


      setSubmitting(true);

      setError("");



      const res =
        await createBooking(formData);



      setBooking(
        res.data.data
      );



      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });



    } catch (err) {


      console.log(err);


      setError(

        err.response?.data?.message ||
        "Booking failed."

      );



    } finally {


      setSubmitting(false);


    }

  };





  // SUCCESS PAGE

  if (booking) {

    return (

      <main className="
      min-h-screen 
      bg-slate-50 
      flex 
      items-center 
      justify-center 
      py-32 
      px-6
      ">


        <div className="
        max-w-xl
        w-full
        bg-white
        rounded-3xl
        shadow-xl
        p-10
        text-center
        ">


          <FaCheckCircle
            className="
        text-green-500
        text-7xl
        mx-auto
        "
          />


          <h1 className="
        text-4xl
        font-black
        mt-6
        ">
            Booking Successful
          </h1>



          <p className="
        text-gray-500
        mt-4
        ">
            Your booking has been submitted successfully.
          </p>



          <div className="
        bg-slate-950
        rounded-2xl
        mt-8
        p-6
        ">


            <p className="text-gray-400">
              Booking ID
            </p>


            <h2 className="
          text-yellow-400
          text-3xl
          font-black
          mt-2
          ">
              {booking.bookingId}
            </h2>


          </div>



          <div className="
        grid
        md:grid-cols-2
        gap-4
        mt-8
        ">


            <Link
              to={`/track-booking?bookingId=${booking.bookingId}`}
              className="
        bg-yellow-400
        py-4
        rounded-xl
        font-bold
        ">
              Track Booking
            </Link>



            <button

              onClick={() => {

                setBooking(null);

                setFormData({
                  ...initialForm,
                  fullName: formData.fullName,
                  mobileNumber: formData.mobileNumber,
                  whatsappNumber: formData.whatsappNumber,
                  email: formData.email,
                  address: formData.address
                });


              }}

              className="
        border-2
        border-slate-900
        rounded-xl
        py-4
        font-bold
        "
            >

              New Booking

            </button>



          </div>


        </div>


      </main>

    );

  }
  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-50
      ">

        <h2 className="
        text-2xl
        font-black
        ">
          Loading Booking Form...
        </h2>

      </main>
    );
  }




  return (
    <main className="min-h-screen bg-slate-50">


      {/* HERO */}

      <section className="
      bg-slate-950
      pt-40
      pb-24
      text-center
      ">

        <div className="
        max-w-3xl
        mx-auto
        px-6
        ">


          <span className="
          inline-flex
          items-center
          gap-2
          text-yellow-400
          font-bold
          uppercase
          tracking-widest
          ">

            <FaBolt />

            Online Booking

          </span>



          <h1 className="
          text-4xl
          md:text-6xl
          font-black
          text-white
          mt-5
          ">

            Book an Electrician

          </h1>



          <p className="
          text-gray-400
          text-lg
          mt-6
          ">

            Logged in users can book electricians in few seconds.

          </p>


        </div>


      </section>





      {/* FORM */}

      <section className="
      max-w-5xl
      mx-auto
      px-6
      py-20
      ">


        <form

          onSubmit={handleSubmit}

          className="
      bg-white
      rounded-3xl
      shadow-xl
      p-6
      md:p-10
      ">


          {
            error && (

              <div className="
          bg-red-50
          border
          border-red-200
          text-red-600
          rounded-xl
          p-4
          mb-8
          ">

                {error}

              </div>

            )
          }




          <h2 className="
      text-2xl
      font-black
      mb-7
      ">

            Customer Information

          </h2>




          <div className="
      grid
      md:grid-cols-2
      gap-6
      ">


            <Input

              label="Full Name"

              name="fullName"

              value={formData.fullName}

              onChange={handleChange}

              required

            />



            <Input

              label="Mobile Number"

              name="mobileNumber"

              value={formData.mobileNumber}

              onChange={handleChange}

              required

            />



            <Input

              label="WhatsApp Number"

              name="whatsappNumber"

              value={formData.whatsappNumber}

              onChange={handleChange}

              required

            />



            <Input

              label="Email"

              name="email"

              type="email"

              value={formData.email}

              onChange={handleChange}

            />



          </div>





          <h2 className="
      text-2xl
      font-black
      mt-12
      mb-7
      ">

            Service Details

          </h2>





          <div className="
      grid
      md:grid-cols-2
      gap-6
      ">



            <Select

              label="Select Service"

              name="service"

              value={formData.service}

              onChange={handleChange}

              required

            >


              <option value="">
                Select Service
              </option>



              {
                services.map(service => (

                  <option

                    key={service._id}

                    value={service._id}

                  >

                    {service.name}

                  </option>

                ))
              }


            </Select>





            <Select

              label="Service Area"

              name="area"

              value={formData.area}

              onChange={handleChange}

              required

            >

              <option value="">
                Select Area
              </option>



              {
                areas.map(area => (

                  <option

                    key={area._id}

                    value={area._id}

                  >

                    {area.name}

                  </option>

                ))
              }


            </Select>





            <Input

              label="Preferred Date"

              type="date"

              name="preferredDate"

              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }

              value={formData.preferredDate}

              onChange={handleChange}

              required

            />





            <Input

              label="Preferred Time"

              type="time"

              name="preferredTime"

              value={formData.preferredTime}

              onChange={handleChange}

              required

            />





            <Select

              label="Service Type"

              name="serviceType"

              value={formData.serviceType}

              onChange={handleChange}

            >


              <option value="normal">
                Normal Service
              </option>


              <option value="emergency">
                Emergency Service
              </option>


            </Select>




          </div>





          {/* ADDRESS */}


          <div className="mt-8">


            <label className="
      font-bold
      flex
      items-center
      gap-2
      ">


              <FaMapMarkerAlt
                className="text-yellow-500"
              />


              Complete Address


            </label>



            <textarea

              rows="3"

              required

              name="address"

              value={formData.address}

              onChange={handleChange}

              className="
      w-full
      mt-2
      border
      border-gray-300
      rounded-xl
      px-5
      py-4
      outline-none
      focus:border-yellow-400
      "

              placeholder="House no, Street, Area..."

            />


          </div>






          {/* PROBLEM */}


          <div className="mt-8">


            <label className="font-bold">

              Problem Description

            </label>



            <textarea

              rows="5"

              name="problemDescription"

              value={formData.problemDescription}

              onChange={handleChange}

              className="
      w-full
      mt-2
      border
      border-gray-300
      rounded-xl
      px-5
      py-4
      outline-none
      focus:border-yellow-400
      "

              placeholder="Describe your electrical problem..."

            />



          </div>





          <button

            type="submit"

            disabled={submitting}

            className="
      w-full
      mt-10
      bg-yellow-400
      hover:bg-yellow-300
      text-black
      font-black
      py-5
      rounded-xl
      transition
      disabled:opacity-50
      "

          >


            {
              submitting
                ?
                "Creating Booking..."
                :
                "Confirm Booking"
            }


          </button>




        </form>


      </section>


    </main>
  );

};






// ============================
// INPUT COMPONENT
// ============================


const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  min
}) => {


  return (

    <div>


      <label className="font-bold">

        {label}

      </label>


      <input

        type={type}

        name={name}

        value={value}

        onChange={onChange}

        required={required}

        min={min}

        className="
w-full
mt-2
border
border-gray-300
rounded-xl
px-5
py-4
outline-none
focus:border-yellow-400
"

        placeholder={label}

      />


    </div>

  );


};






// ============================
// SELECT COMPONENT
// ============================


const Select = ({
  label,
  name,
  value,
  onChange,
  children,
  required = false
}) => {


  return (

    <div>


      <label className="font-bold">

        {label}

      </label>


      <select

        name={name}

        value={value}

        onChange={onChange}

        required={required}

        className="
w-full
mt-2
border
border-gray-300
rounded-xl
px-5
py-4
outline-none
bg-white
focus:border-yellow-400
"

      >


        {children}


      </select>


    </div>


  );


};





export default Booking;