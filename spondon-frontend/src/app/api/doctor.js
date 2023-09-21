import { api_url } from ".";
import axios from "axios";

export const getUploadedDocuments = async (page) =>
  axios.get(api_url(`/doctor/uploaded?page=${page}`)).then((res) => res.data);

export const getSharedDocuments = async (page) =>
  axios.get(api_url(`/doctor/shared?page=${page}`)).then((res) => res.data);

export const accessEmergencyProfile = async (username) =>
  axios.get(api_url(`/doctor/emergency/${username}`)).then((res) => res.data);

export const getProfile = () =>
  axios.get(api_url("/doctor/profile")).then((res) => res.data);

export const updateProfile = (profile) =>
  axios.put(api_url("/doctor/profile"), profile).then((res) => res.data);
