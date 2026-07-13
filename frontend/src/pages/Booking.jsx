import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createBooking } from "../services/bookingApi";


const Booking = () => {

    const { serviceId } = useParams();


    const [loading, setLoading] = useState(false);



    const [form, setForm] = useState({

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
        serviceType: "normal"

    });



    // Set service id from URL

    useEffect(() => {

        console.log("URL Service ID:", serviceId);


        setForm(prev => ({

            ...prev,

            service: serviceId || ""

        }));


    }, [serviceId]);





    const handleChange = (e) => {


        setForm({

            ...form,

            [e.target.name]: e.target.value

        });


    };





    const submitHandler = async (e) => {

        e.preventDefault();


        console.log("Final Booking Data:", form);



        if (!form.service) {

            alert("Service not selected");

            return;

        }


        setLoading(true);



        try {


            const data = await createBooking(form);


            console.log(data);


            alert(
                "Booking Created Successfully"
            );



            setForm({

                fullName: "",
                mobileNumber: "",
                whatsappNumber: "",
                email: "",
                address: "",
                area: "",
                service: serviceId,
                preferredDate: "",
                preferredTime: "",
                problemDescription: "",
                serviceType: "normal"

            });



        } catch (error) {


            console.log(
                error.response?.data
            );


            alert(

                error.response?.data?.message ||
                "Booking Failed"

            );


        } finally {

            setLoading(false);

        }



    };






    return (

        <div className="max-w-3xl mx-auto py-20 px-6">


            <h1 className="text-4xl font-bold mb-8">

                Book Electrical Service

            </h1>



            <form

                onSubmit={submitHandler}

                className="space-y-5"

            >



                <input
                    required
                    name="fullName"
                    value={form.fullName}
                    placeholder="Full Name"
                    onChange={handleChange}
                    className="border p-3 w-full rounded"
                />



                <input
                    required
                    name="mobileNumber"
                    value={form.mobileNumber}
                    placeholder="Mobile Number"
                    onChange={handleChange}
                    className="border p-3 w-full rounded"
                />



                <input
                    required
                    name="whatsappNumber"
                    value={form.whatsappNumber}
                    placeholder="WhatsApp Number"
                    onChange={handleChange}
                    className="border p-3 w-full rounded"
                />



                <input
                    name="email"
                    value={form.email}
                    placeholder="Email"
                    onChange={handleChange}
                    className="border p-3 w-full rounded"
                />



                <input
                    required
                    name="address"
                    value={form.address}
                    placeholder="Complete Address"
                    onChange={handleChange}
                    className="border p-3 w-full rounded"
                />



                <input
                    required
                    name="area"
                    value={form.area}
                    placeholder="Area"
                    onChange={handleChange}
                    className="border p-3 w-full rounded"
                />



                <input
                    required
                    type="date"
                    name="preferredDate"
                    value={form.preferredDate}
                    onChange={handleChange}
                    className="border p-3 w-full rounded"
                />



                <input
                    required
                    name="preferredTime"
                    value={form.preferredTime}
                    placeholder="Preferred Time"
                    onChange={handleChange}
                    className="border p-3 w-full rounded"
                />



                <textarea

                    name="problemDescription"

                    value={form.problemDescription}

                    placeholder="Problem Description"

                    onChange={handleChange}

                    className="border p-3 w-full rounded"

                />




                <select

                    name="serviceType"

                    value={form.serviceType}

                    onChange={handleChange}

                    className="border p-3 w-full rounded"

                >


                    <option value="normal">
                        Normal Service
                    </option>


                    <option value="emergency">
                        Emergency Service
                    </option>


                </select>




                <button

                    disabled={loading}

                    className="bg-yellow-500 px-8 py-3 rounded-lg font-bold"

                >

                    {
                        loading
                            ?
                            "Booking..."
                            :
                            "Confirm Booking"
                    }


                </button>



            </form>



        </div>

    )

};


export default Booking;