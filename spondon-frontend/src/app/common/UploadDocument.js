import { useState } from "react";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { FileUploader } from "react-drag-drop-files";
import { aesGcmDecrypt, aesGcmEncrypt } from "./aes-gcm";
import {
  decryptPassword,
  encryptPassword,
  generateKeys,
} from "./public-private-encryption";
import { save } from "./download";
import { getHash } from "./sha256";

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

export default function UploadDocument() {
  const [fileDetails, setFileDetails] = useState({
    file: null,
    name: "",
    summary: "",
    hash: "",
    type: "",
    url: "",
    statistics: "",
    owner: null,
    creationDate: "",
    encryption: false,
  });

  const [selectableUsers, setSelectableUsers] = useState([]);

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
                          let date = new Date(file.lastModifiedDate);
                          date = new Date(
                            date.getTime() - date.getTimezoneOffset() * 60000
                          );
                          date = date.toISOString().split("T")[0];
                          const hash = await getHash(file);
                          setFileDetails({
                            ...fileDetails,
                            file: file,
                            name: file.name,
                            creationDate: date,
                            hash: hash,
                          });
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
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="documentSummery">
                        {" "}
                        Document Summary (not saved){" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="documentSummery"
                        contentEditable={false}
                        placeholder="Document Summary"
                        value={fileDetails.summary}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="documentType">
                        Anonymous Health Statistics
                      </label>
                      <select
                        className="form-control"
                        id="documentType"
                        value={fileDetails.statistics}
                        onChange={(e) => {
                          setFileDetails({
                            ...fileDetails,
                            statistics: e.target.value,
                          });
                        }}
                      >
                        <option value={""}>None</option>
                        <option value={"Hepatitis"}>Hepatitis</option>
                        <option value={"Maleria"}>Maleria</option>
                        <option value={"Dengue"}>Dengue</option>
                        <option value={"Covid-19"}>Covid-19</option>
                        <option value={"Polio"}>Polio</option>
                      </select>
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
                        selected={fileDetails.owner}
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
                        disabled={!fileDetails.owner?.publicKey}
                        title={
                          !fileDetails.owner?.publicKey &&
                          "Please select a user with public key to encrypt the document"
                        }
                        value={
                          fileDetails.owner?.publicKey && fileDetails.encryption
                        }
                        onChange={(e) => {
                          setFileDetails({
                            ...fileDetails,
                            encryption: e.target.value,
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
                        value={fileDetails.creationDate}
                        onChange={(e) => {
                          setFileDetails({
                            ...fileDetails,
                            creationDate: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <p className="card-description">Owner Details</p>
                <div className="flex mb-4">
                  {fileDetails.owner && `${fileDetails.owner.name}`}
                </div>

                <button type="submit" className="btn btn-gradient-primary mr-2">
                  Submit
                </button>
                <button className="btn btn-light">Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
