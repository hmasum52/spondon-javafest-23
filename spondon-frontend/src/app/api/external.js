import axios from "axios";

const IMGBB_API = "https://api.imgbb.com/1/upload"
const IMGBB_API_KEY = 'f96dcb0d10309fcb8be71d9b7a82022a'

const IP_TO_LOCATION_API = "http://ip-api.com/json/?fields=status,message,lat,lon,country,city" // "https://ipapi.co/json/"

export const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append("image", file);
    const {data} = await axios.post(`${IMGBB_API}?key=${IMGBB_API_KEY}`,
        formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    
    return data.data.url
}

export const getIpLocation = async () => {
    const {data} = await axios.get(IP_TO_LOCATION_API)
    if (data.status !== "success") {
        throw new Error(data.message)
    }
    return data
}