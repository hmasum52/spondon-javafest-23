import React, { Component, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { getHash } from "../common/sha256";
import { verifyDocuemnt } from "../api/document";
import { formatDateFromTimestamp } from "../user/SharedByMe";

const override = {
  display: "block",
  margin: "1rem auto",
};

export default function LockScreen() {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);

  return (
    <div>
      <div
        className="content-wrapper d-flex align-items-center lock-full-bg h-100"
        style={{
          background: "#f2edf3",
        }}
      >
        <div className="row w-100 align-items-center">
          <div className="col-xl-4 col-lg-6 col-md-8 col-sm-9 mx-auto">
            {/* auth-form-transparent */}
            <div className=" text-left p-5 text-center">
              {/* <img
                src={require("../../assets/images/faces/face13.jpg")}
                className="lock-profile-img"
                alt="img"
              /> */}
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">Select Document To Verify</h4>
                  <HashLoader
                    color="#1bcfb4"
                    loading={loading}
                    cssOverride={override}
                  />
                  <form className="pt-0">
                    <div className="form-group">
                      <FileUploader
                        classes="w-100"
                        label="Upload or drop your document here"
                        handleChange={(file) => {
                          setLoading(true);
                          toast.promise(
                            getHash(file).then((hash) => {
                              verifyDocuemnt(hash).then((res) => {
                                setLoading(false);
                                setDetails(res);
                              });
                            }),
                            {
                              loading: "Verifying document...",
                              success: "Check the verification result",
                              error: "Error verifying",
                            }
                          );
                        }}
                        name="file"
                        types={["PDF"]}
                      />
                    </div>
                    {details !== null &&
                      (details.length === 0 ? (
                        <div className="alert alert-danger">
                          Document not found
                        </div>
                      ) : (
                        <>
                          {details.map((detail) => (
                            <table className="table table-bordered my-2">
                              <tbody>
                                <tr>
                                  <th>Name</th>
                                  <td>{detail.name}</td>
                                </tr>
                                <tr>
                                  <th>Type</th>
                                  <td>{detail.type || "Not Provided"}</td>
                                </tr>
                                <tr>
                                  <th>Owner</th>
                                  <td>{detail.owner}</td>
                                </tr>
                                <tr>
                                  <th>Uploader</th>
                                  <td>
                                    {detail.uploader}{" "}
                                    {detail.verifiedUploader && (
                                      <Badge bg="success" className="ml-2">
                                        Verified Doctor
                                      </Badge>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <th>Creation Time</th>
                                  <td>
                                    {formatDateFromTimestamp(
                                      detail.creationTime
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <th>Upload Time</th>
                                  <td>
                                    {formatDateFromTimestamp(
                                      detail.uploadedTime
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ))}
                        </>
                      ))}
                    {/* <div className="mt-3">
                      <Button
                        type="submit"
                        disabled={!hash}
                        title={!hash && "Please select a file"}
                        className="btn btn-block btn-success btn-lg font-weight-medium"
                        to="/dashboard"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        Verify
                      </Button>
                    </div> */}
                    <div className="mt-3 text-center">
                      <Link to="/" className="text-info">
                        Back to homepage
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
