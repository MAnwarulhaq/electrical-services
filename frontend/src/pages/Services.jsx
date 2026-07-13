import {useEffect,useState} from "react";

import ServiceCard from "../components/ServiceCard";

import {getServices} from "../services/serviceApi";



const Services = ()=>{


const [services,setServices]=useState([]);

const [loading,setLoading]=useState(true);




useEffect(()=>{

loadServices();

},[]);




const loadServices = async()=>{


try{


const response = await getServices();


console.log(response);



setServices(response.data || []);



}catch(error){


console.log(error);


}

finally{


setLoading(false);


}


};





if(loading){

return(

<div className="text-center py-40 text-3xl">

Loading Services...

</div>

)

}




return(


<section className="py-20 bg-gray-50">


<div className="max-w-7xl mx-auto px-6">



<h1 className="text-center text-5xl font-bold mb-14">

Our Electrical Services

</h1>



<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">


{
services.map((service)=>(


<ServiceCard

key={service._id}

service={service}

/>


))

}



</div>


</div>


</section>


)


}



export default Services;