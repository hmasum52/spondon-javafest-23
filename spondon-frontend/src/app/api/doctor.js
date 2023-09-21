import { api_url } from ".";
import axios from "axios";

export const getUploadedDocuments = async (page) =>
  axios.get(api_url(`/doctor/uploaded?page=${page}`)).then((res) => res.data);

export const getSharedDocuments = async (page) =>
  axios.get(api_url(`/doctor/shared?page=${page}`)).then((res) => res.data);