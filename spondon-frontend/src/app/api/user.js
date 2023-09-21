import { api_url } from ".";
import axios from "axios";

export const getProfile = async () =>
  axios.get(api_url("/user/profile")).then((res) => res.data);

export const updateProfile = async (profile) =>
  axios.put(api_url("/user/profile"), profile).then((res) => res.data);

export const updateEmergencyProfile = async (profile) =>
  axios
    .put(api_url("/user/profile/emergency"), { emergencyProfile: profile })
    .then((res) => res.data);
