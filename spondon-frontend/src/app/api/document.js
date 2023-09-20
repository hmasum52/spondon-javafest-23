import { api_url } from ".";
import axios from "axios";

export const getPossibleOwners = async () =>
  axios
    .get(api_url("/document-upload/possible-owners"))
    .then((res) => res.data);

export const uploadDocument = async (document) =>
  axios
    .post(api_url("/document-upload/upload"), document)
    .then((res) => res.data);

export const getPossibleDoctors = async () =>
  axios
    .get(api_url("/document-upload/sharable-users"))
    .then((res) => res.data);

export const getOwnedDocuments = async (page) =>
  axios.get(api_url(`/user/document/all?page=${page}`)).then((res) => res.data);

export const getNotAcceptedDocuments = async (page) =>
  axios
    .get(api_url(`/user/document/pending?page=${page}`))
    .then((res) => res.data);

export const acceptDocument = async (id) =>
  axios.put(api_url(`/user/document/approve/${id}`)).then((res) => res.data);

export const getCollections = async () =>
  axios.get(api_url(`/user/document/collections`)).then((res) => res.data);

export const setToCollection = async (documentId, collectionId) =>
  axios
    .put(api_url(`/user/document/set-collection/${documentId}`), {
      id: collectionId,
    })
    .then((res) => res.data);

export const addCollection = async (name) =>
  axios
    .post(api_url(`/user/document/collection`), { name })
    .then((res) => res.data);

export const editCollection = async (id, name) =>
  axios
    .put(api_url(`/user/document/collection/${id}`), { name })
    .then((res) => res.data);

export const deleteCollection = async (id) =>
  axios
    .delete(api_url(`/user/document/collection/${id}`))
    .then((res) => res.data);

export const getCollectionDocuments = async (id, page) =>
  axios
    .get(api_url(`/user/document/collection/${id}?page=${page}`))
    .then((res) => res.data);

export const shareDocument = async (userId, documents) =>
  axios
    .post(api_url(`/user/document/share/${userId}`), documents)
    .then((res) => res.data);