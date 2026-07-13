import API from "./api";


export const createBooking = async(data)=>{

    const res = await API.post(
        "/bookings",
        data
    );

    return res.data;

};




export const trackBooking = async(id)=>{

    const res = await API.get(
        `/bookings/track/${id}`
    );


    return res.data;

};