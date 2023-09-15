import axios from "axios";

const IMGBB_API = "https://api.imgbb.com/1/upload"
const IMGBB_API_KEY = 'f96dcb0d10309fcb8be71d9b7a82022a'

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