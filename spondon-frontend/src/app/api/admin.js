import {api_url} from "."
import axios from "axios";

export const addDoctorRequest = async (email) =>
    axios.post(api_url("/admin/add-doctor"), { email }).then(res => res.data);