import { api_url } from ".";
import axios from "axios";

export const getPossibleOwners = async () =>
    axios.get(api_url("/document-upload/possible-owners")).then(res => res.data);

export const uploadDocument = async (document) =>
    axios.post(api_url("/document-upload/upload"), document).then(res => res.data);