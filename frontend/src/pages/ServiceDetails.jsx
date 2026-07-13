import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getServiceBySlug } from "../services/serviceApi";


const ServiceDetails = () => {


    const { slug } = useParams();

    const [service, setService] = useState(null);


    useEffect(() => {

        loadService();

    }, []);



    const loadService = async () => {

        try {

            const data = await getServiceBySlug(slug);

            console.log(data);

            setService(data.data);


        } catch (error) {

            console.log(error);

        }

    };



    if (!service) {

        return <h1>Loading...</h1>

    }



    return (

        <div className="max-w-6xl mx-auto py-20 px-6">


            <img

                src={
                    service.image
                        ? `http://localhost:5000${service.image}`
                        : "/default.jpg"
                }

                className="w-full h-[400px] object-cover rounded-xl"

            />



            <h1 className="text-5xl font-bold mt-8">

                {service.name}

            </h1>



            <p className="text-gray-600 text-lg mt-5">

                {service.fullDescription}

            </p>




            <h2 className="text-2xl font-bold mt-6">

                What's Included

            </h2>


            <ul>

                {
                    service.whatsIncluded?.map((item, index) => (

                        <li key={index}>

                            ✓ {item}

                        </li>

                    ))
                }

            </ul>




            <h2 className="text-3xl font-bold mt-6 text-blue-600">

                Starting Price: Rs {service.startingPrice}

            </h2>



            <p>

                Estimated Time: {service.estimatedTime}

            </p>



            <Link

                to={`/booking/${service._id}`}

                className="inline-block mt-8 bg-yellow-500 px-8 py-3 rounded-lg"

            >

                Book Now

            </Link>



        </div>

    )


}


export default ServiceDetails;