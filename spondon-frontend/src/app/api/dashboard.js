import axios from "axios";
import { api_url } from ".";

export const getDashboard = async () => 
    axios.get(api_url("/")).then(res => res.data)