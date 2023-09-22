import { api_url } from ".";
import axios from "axios";

export const getPossibleOwners = async () =>
  axios.get(api_url("/common/possible-owners")).then((res) => res.data);

export const uploadDocument = async (document) =>
  axios.post(api_url("/common/upload"), document).then((res) => res.data);

export const getPossibleDoctors = async () =>
  axios.get(api_url("/common/sharable-users")).then((res) => res.data);

export const revokeAccess = async (shareId) =>
  axios.delete(api_url(`/common/revoke/${shareId}`));

export const getOwnedDocuments = async (page) =>
  axios.get(api_url(`/user/document/all?page=${page}`)).then((res) => res.data);

export const getNotAcceptedDocuments = async (page) =>
  axios
    .get(api_url(`/user/document/pending?page=${page}`))
    .then((res) => res.data);

export const acceptDocument = async (id) =>
  axios.put(api_url(`/user/document/approve/${id}`)).then((res) => res.data);

export const getCollections = async () =>
  axios.get(api_url(`/common/collections`)).then((res) => res.data);

export const setToCollection = async (documentId, collectionId) =>
  axios
    .put(api_url(`/common/set-collection/${documentId}`), {
      id: collectionId,
    })
    .then((res) => res.data);

export const addCollection = async (name) =>
  axios.post(api_url(`/common/collection`), { name }).then((res) => res.data);

export const editCollection = async (id, name) =>
  axios
    .put(api_url(`/common/collection/${id}`), { name })
    .then((res) => res.data);

export const deleteCollection = async (id) =>
  axios.delete(api_url(`/common/collection/${id}`)).then((res) => res.data);

export const getCollectionDocuments = async (id, page) =>
  axios
    .get(api_url(`/common/collection/${id}?page=${page}`))
    .then((res) => res.data);

export const shareDocument = async (userId, documents) =>
  axios
    .post(api_url(`/common/share/${userId}`), documents)
    .then((res) => res.data);

export const getSharedDocuments = async (page) =>
  axios
    .get(api_url(`/user/document/shared?page=${page}`))
    .then((res) => res.data);

export const verifyDocuemnt = async (hash) =>
  axios.get(api_url(`/public/verify/${hash}`)).then((res) => res.data);

export const getLogs = async (page) =>
  axios.get(api_url(`/common/logs?page=${page}`)).then((res) => res.data);
