import { useEffect, useRef, useState } from "react";
import { Form, ProgressBar, Table } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { FileUploader } from "react-drag-drop-files";
import { v4 as uuidv4 } from "uuid";
import { aesEncrypt, aesGcmDecrypt, aesGcmEncrypt } from "./aes-gcm";
import {
  decryptPassword,
  encryptPassword,
  generateKeys,
} from "./public-private-encryption";
import { save } from "./download";
import { getHash } from "./sha256";
import { getPossibleOwners, uploadDocument } from "../api/document";
import {
  getIpLocation,
  questionToChatPdf,
  removeFromChatPdf,
  uploadToChatPdf,
} from "../api/external";
import { storage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import toast from "react-hot-toast";
import { decryptDocument } from "../user/Document";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const dateFromTimestamp = (timestamp) => {
  let date = new Date(timestamp);
  date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return date.toISOString().split("T")[0];
};

const generateRandomPassword = () => {
  let chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let passwordLength = 12;
  let password = "";
  for (let i = 0; i <= passwordLength; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  console.log(`Password: ${password}`);
  return password;
};

const initialState = {
  file: null,
  name: "",
  summary: "",
  hash: "",
  type: "Others",
  url: "",
  owner: null,
  creationDate: "",
  latitide: 0,
  longitude: 0,
  encryption: true,
};

export default function UploadDocument() {
  const [fileDetails, setFileDetails] = useState(initialState);

  const [selectableUsers, setSelectableUsers] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getPossibleOwners().then((users) => {
      setSelectableUsers(users);
    });
    getIpLocation()
      .then((location) => {
        console.log("location: ", location);
        setFileDetails({
          ...fileDetails,
          latitide: location.lat,
          longitude: location.lon,
        });
      })
      .catch((e) => console.log(e));
  }, []);

  let creationDate = null;
  if (fileDetails.creationDate) {
    creationDate = dateFromTimestamp(fileDetails.creationDate);
  }

  const uploadToFirebase = (documentId, file) =>
    new Promise((resolve, reject) => {
      const toastId = toast.loading("Uploading document...");
      const storageRef = ref(storage, `/documents/${documentId}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(percent);
        },
        (e) => {
          toast.dismiss(toastId);
          toast.error("File upload failed!");
          console.log(e);
          reject(e);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
          });
          toast.dismiss(toastId);
          toast.success("File uploaded successfully!");
          resolve();
        }
      );
    });

  const encryptFile = (file, aesKey) =>
    new Promise((resolve, reject) => {
      const toastId = toast.loading("Encrypting document...");
      const reader = new FileReader();
      reader.onload = async (e) => {
        // To byte array
        const encrypted = await aesEncrypt(reader.result, aesKey);
        const encryptedFile = new File(
          [new Blob([encrypted], { type: "text/plain" })],
          file.name,
          {
            type: file.type,
          }
        );
        toast.dismiss(toastId);
        toast.success("Document encrypted successfully!");
        resolve(encryptedFile);
      };
      reader.onerror = (e) => {
        toast.dismiss(toastId);
        toast.error("Document encryption failed!");
        reject(e);
      };
      reader.readAsArrayBuffer(file);
    });

  const uploadFile = async (e) => {
    e.preventDefault();

    if (!fileDetails.file) {
      toast.error("Please select a file to upload!");
      return;
    }

    if (!fileDetails.owner) {
      toast.error("Please select a owner for the document!");
      return;
    }

    const documentId = uuidv4();
    let {
      name,
      summary: anonymous,
      hash,
      creationDate: creationTime,
      type,
      latitide: latitude,
      longitude,
      owner,
      file,
      encryption,
    } = fileDetails;

    let aesKey = "";

    if (encryption && owner?.user.publicKey) {
      const password = generateRandomPassword();
      console.log("password: ", password);
      const publicKey = owner.user.publicKey;
      console.log("publicKey: ", publicKey);
      aesKey = await encryptPassword(password, publicKey);
      console.log("aesKey: ", aesKey);
      file = await encryptFile(file, password);
    }

    await uploadToFirebase(documentId, file);

    owner = owner?.user?.username;
    const toastId = toast.loading("Uploading document details...", {
      duration: 5000,
    });
    await uploadDocument({
      documentId,
      name,
      anonymous,
      hash,
      creationTime,
      type,
      latitude,
      longitude,
      owner,
      aesKey,
    });
    toast.dismiss(toastId);
    toast.success("Document uploaded successfully!");
    setFileDetails(initialState);
    setProgress(0);
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Add New Document </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Document
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Upload
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              {/* <h4 className="card-title">Document Details</h4> */}

              <p className="card-description"> Upload Medical Document </p>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <FileUploader
                      classes="w-100"
                      label="Upload or drop your document here"
                      handleChange={(file) => {
                        (async () => {
                          const hash = await getHash(file);
                          setFileDetails((fileDetails) => ({
                            ...fileDetails,
                            file: file,
                            name: file.name,
                            creationDate: file.lastModifiedDate.getTime(),
                            hash: hash,
                          }));
                          toast.promise(
                            new Promise((resolve, reject) => {
                              (async () => {
                                const sourceId = await uploadToChatPdf(file);
                                console.log("sourceId: ", sourceId);
                                // await delay(5000);
                                // console.log("delayed");
                                const about = await questionToChatPdf(
                                  sourceId,
                                  "What is this medical document about?"
                                );
                                console.log("about: ", about);
                                setFileDetails((fileDetails) => ({
                                  ...fileDetails,
                                  summary: about,
                                }));
                                resolve("Document analyzed successfully!");
                                removeFromChatPdf(sourceId);
                              })().catch((e) => {
                                console.log(e);
                                reject(e);
                              });
                            }),
                            {
                              loading: "Analyzing document...",
                              success: "Document analyzed successfully!",
                              error: (e) => {
                                console.log(e);
                                return "Document analysis failed!";
                              },
                            }
                          );
                        })();
                      }}
                      name="file"
                      types={["PDF"]}
                    />
                  </div>
                </div>
              </div>

              <form className="form-sample">
                <p className="card-description"> Document Information </p>
                {/* Document Hash */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="documentHash">Document Hash</label>
                      <input
                        type="text"
                        className="form-control"
                        id="documentHash"
                        placeholder="Document Hash"
                        value={fileDetails.hash}
                        contentEditable={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="documentName">
                        Document Information{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="documentName"
                        placeholder="Document Name"
                        value={fileDetails.name}
                        onChange={(e) => {
                          setFileDetails({
                            ...fileDetails,
                            name: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="documentType">Document Type</label>
                      <select
                        className="form-control"
                        id="documentType"
                        value={fileDetails.type}
                        onChange={(e) => {
                          setFileDetails({
                            ...fileDetails,
                            type: e.target.value,
                          });
                        }}
                      >
                        <option value="Prescription">Prescription</option>
                        <option value="X-Ray / CT Scan">X-Ray / CT Scan</option>
                        <option value={"Pathological Test"}>
                          Pathological Test
                        </option>
                        <option value={"Medical Certificate"}>
                          Medical Certificate
                        </option>
                        <option value={"Others"}>Others</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="documentSummery">
                        {" "}
                        Document Summary (collected anonymously for public
                        health analysis){" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="documentSummery"
                        onChange={(e) => {
                          setFileDetails({
                            ...fileDetails,
                            summary: e.target.value,
                          });
                        }}
                        placeholder="Document Summary"
                        value={fileDetails.summary}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 ">
                    <div className="form-group">
                      <label htmlFor="documentOwner">Document Owner</label>
                      <Typeahead
                        onChange={(selected) => {
                          setFileDetails({
                            ...fileDetails,
                            owner: selected[0],
                          });
                        }}
                        options={selectableUsers}
                        labelKey={(option) =>
                          `${option.name} (${option.birthCertificateNumber})`
                        }
                        filterBy={["name", "birthCertificateNumber"]}
                        placeholder="Owner of the document..."
                      />
                    </div>
                  </div>
                  <div className="col-md-2 ">
                    <div className="form-group">
                      <label htmlFor="documentEncryption">Encryption</label>
                      <input
                        type="checkbox"
                        className="form-control big-checkbox"
                        disabled={!fileDetails.owner?.user.publicKey}
                        title={
                          !fileDetails.owner?.user.publicKey &&
                          "Please select a user with public key to encrypt the document"
                        }
                        checked={
                          fileDetails.owner?.user.publicKey &&
                          fileDetails.encryption
                        }
                        onChange={(e) => {
                          setFileDetails({
                            ...fileDetails,
                            encryption: e.target.checked,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 ">
                    <div className="form-group">
                      <label htmlFor="documentEncryption">Creation Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={creationDate}
                        onChange={(e) => {
                          const [year, month, day] = e.target.value.split("-");
                          setFileDetails({
                            ...fileDetails,
                            creationDate: new Date(
                              `${month}/${day}/${year}`
                            ).getTime(),
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <p className="card-description">Owner Details</p>
                <div className="flex mb-4">
                  {fileDetails.owner && (
                    <Table striped bordered hover>
                      <tbody>
                        <tr>
                          <th>Image</th>
                          <th>
                            Name (Username: {fileDetails.owner.user.username})
                          </th>
                          <th>Birth Certificate #</th>
                        </tr>
                        <tr>
                          <td>
                            <img
                              src={fileDetails.owner.imageURL}
                              alt="Profile"
                            />
                          </td>
                          <td>{fileDetails.owner.name}</td>
                          <td>{fileDetails.owner.birthCertificateNumber}</td>
                        </tr>
                      </tbody>
                    </Table>
                  )}
                </div>

                <ProgressBar
                  className={`w-100 mb-3 ${!progress ? "d-none" : ""}`}
                  style={{ height: "2rem" }}
                  variant="success"
                  animated
                  now={progress}
                  max={100}
                />

                <button
                  type="submit"
                  className="btn btn-gradient-primary mr-2"
                  onClick={uploadFile}
                >
                  Submit
                </button>
                <button
                  className="btn btn-light"
                  onClick={(e) => {
                    e.preventDefault();
                    setFileDetails(initialState);
                    setProgress(0);
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
