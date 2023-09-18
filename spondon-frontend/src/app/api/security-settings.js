import axios from "axios";
import { api_url } from ".";

export const getUserDetails = async () => 
    axios.get(api_url("/security/details")).then(res => res.data)

export const updateUsernameEmail = async (username, email) =>
    axios.put(api_url("/security/update-username-email"), { username, email }).then(res => res.data);

export const updatePassword = async (oldPassword, newPassword) =>
    axios.put(api_url("/security/update-password"), { oldPassword, newPassword }).then(res => res.data);

export const updatePublicKey = async (publicKey) =>
    axios.put(api_url("/security/update-public-key"), { publicKey }).then(res => res.data);


