import { api_url } from ".";
import axios from "axios";

export const addDoctorRequest = async (email) =>
  axios.post(api_url("/admin/add-doctor"), { email }).then((res) => res.data);

export const getUsers = async (page) =>
  axios.get(api_url(`/admin/users?page=${page}`)).then((res) => res.data);

export const changeUserBannedStatus = async (id, banned) =>
  axios(api_url(`/admin/user/${id}`), {
    method: "PUT",
    data: { banned },
  }).then((res) => res.data);

export const filterAndAnalyze = async (data) =>
  axios.post(api_url("/admin/filter"), data).then((res) => res.data);
