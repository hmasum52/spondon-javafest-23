import axios from "axios";
import { api_url } from ".";

export const login = async (username, password) =>
    axios.post(api_url("/auth/login"), { username, password }).then(res => res.data);

export const register = async (username, email, password) => 
    axios.post(api_url("/auth/register"), { username, email, password }).then(res => res.data);

export const activate = async (jwt, userInfo) =>
    axios.post(api_url("/auth/activate"), {...userInfo, jwt}).then(res => res.data);

export const forgetPassword = async (email) =>
    axios.post(api_url("/auth/forgot-request"), { email }).then(res => res.data);

export const resetPassword = async (jwt, password) =>
    axios.post(api_url("/auth/forgot-reset"), { jwt, password }).then(res => res.data);

export const registerDoctor = async (jwt, userInfo) =>
    axios.post(api_url("/auth/add-doctor"), {jwt, ...userInfo}).then(res => res.data);