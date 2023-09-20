import { getDownloadURL, ref } from "firebase/storage";
import { Badge } from "react-bootstrap";
import { storage } from "../firebase-config";
import axios from "axios";
import { decryptPassword } from "../common/public-private-encryption";
import { aesDecrypt, aesGcmDecrypt } from "../common/aes-gcm";
import toast from "react-hot-toast";
import { acceptDocument } from "../api/document";
import { useState } from "react";
import ShareModal from "./ShareModal";

export async function downloadFromFirebase(documentId) {
  const storageRef = ref(storage, `documents/${documentId}`);
  const url = await getDownloadURL(storageRef);
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });
  return response.data;
}

export async function decryptDocument(document, aesKey) {
  const privateKey = localStorage.getItem("privateKey");
  if (!privateKey) throw new Error("Private Key not found");
  const password = decryptPassword(aesKey, privateKey);
  if (!password) throw new Error("Password can not be decrypted");
  console.log(password, document);
  const decryptedDocument = await aesDecrypt(document, password);
  if (!decryptedDocument) throw new Error("Document can not be decrypted");
  return decryptedDocument;
}

export default function Document({
  document,
  collections = [],
  selectedCollection = (d, c) => {},
  aesKey,
}) {
  const secured = document.aesKey;
  const [accepted, setAccepted] = useState(document?.accepted);
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="col-md-6 grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">
            {document.name}{" "}
            <Badge bg={secured ? "success" : "warning"}>
              {" "}
              {secured ? "Secured" : "Not Secured"}
            </Badge>
          </h4>
          <p className="card-description">{document.type}</p>
          <div className="row">
            <div className="col-md-6">
              <p className="text-muted">Owner</p>
              <p>{document.owner?.name}</p>
            </div>
            <div className="col-md-6">
              <p className="text-muted">Uploader</p>
              <p>{document.uploader?.username}</p>
            </div>
            <div className="col-md-6">
              <p className="text-muted">Created At</p>
              <p>{new Date(document.creationTime).toUTCString()}</p>
            </div>
            <div className="col-md-6">
              <p className="text-muted">Uploaded At</p>
              <p>{new Date(document.uploadTime).toUTCString()}</p>
            </div>
          </div>

          {document?.accepted && (
            <div className="col-md-12 mb-2">
              <select
                className="form-control"
                onChange={(e) => {
                  selectedCollection(
                    document.id,
                    Number.parseInt(e.target.value)
                  );
                }}
                value={document.collection?.id || 0}
              >
                <option value={0}>No Collection</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-md-12 mb-2">
            <button
              className="btn btn-outline-info btn-block"
              onClick={(e) => {
                e.preventDefault();
                (async () => {
                  let toastId = toast.loading("Downloading...");
                  try {
                    const doc = await downloadFromFirebase(document.documentId);
                    console.log(document);
                    toast.loading("Decrypting Document...", { id: toastId });
                    const data = secured
                      ? await decryptDocument(doc, aesKey || document.aesKey)
                      : doc;
                    toast.loading("Previewing Document...", { id: toastId });
                    var file = new Blob([data], {
                      type: "application/pdf",
                    });

                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                      // For IE
                      window.navigator.msSaveOrOpenBlob(file, "mypdf.pdf");
                    } else {
                      // For non-IE
                      var fileURL = URL.createObjectURL(file);
                      window.open(fileURL);
                    }
                    toast.success("Document Previewed", { id: toastId });
                  } catch (error) {
                    console.log(error);
                    toast.error("Error Occured: " + error?.message, {
                      id: toastId,
                    });
                  }
                })();
              }}
            >
              View Document
            </button>
          </div>
          {!accepted ? (
            <div className="col-md-12">
              <button
                className="btn btn-success btn-block"
                onClick={(e) => {
                  toast.promise(
                    acceptDocument(document.id).then((e) => setAccepted(true)),
                    {
                      loading: "Accepting Document...",
                      success: "Document Accepted",
                      error: "Error Occured",
                    }
                  );
                }}
              >
                Accept Document
              </button>
            </div>
          ) : (
            <div className="col-md-12">
              <button
                className="btn btn-primary btn-block"
                onClick={() => setShowShareModal(true)}
              >
                Share Document
              </button>
            </div>
          )}
        </div>
      </div>
      <ShareModal
        documents={[document]}
        show={showShareModal}
        setShow={setShowShareModal}
      />
    </div>
  );
}
