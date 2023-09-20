import { api_url } from ".";
import axios from "axios";

export const getUploadedDocuments = async (page) =>
  axios.get(api_url(`/doctor/uploaded?page=${page}`)).then((res) => res.data);

export const getSharedDocuments = async (page) =>
  axios.get(api_url(`/doctor/shared?page=${page}`)).then((res) => res.data);

// Collections

export const getCollections = async () =>
  axios.get(api_url(`/doctor/collections`)).then((res) => res.data);

export const getCollectionDocuments = async (id, page) =>
  axios
    .get(api_url(`/doctor/collection/${id}?page=${page}`))
    .then((res) => res.data);

export const addCollection = async (name) =>
  axios
    .post(api_url(`/doctor/collection`), { name })
    .then((res) => res.data);

export const editCollection = async (id, name) =>
  axios
    .put(api_url(`/doctor/collection/${id}`), { name })
    .then((res) => res.data);

export const deleteCollection = async (id) =>
  axios
    .delete(api_url(`/doctor/collection/${id}`))
    .then((res) => res.data);

export const setToCollection = async (documentId, collectionId) =>
  axios
    .put(api_url(`/doctor/document/set-collection/${documentId}`), {
      id: collectionId,
    })
    .then((res) => res.data);

