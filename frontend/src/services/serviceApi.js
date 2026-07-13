import API from "./api";


export const getServices = async()=>{

    const res = await API.get("/services");

    return res.data;

};



export const getServiceBySlug = async(slug)=>{

    const res = await API.get(`/services/${slug}`);

    return res.data;

};