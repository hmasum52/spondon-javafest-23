import { useEffect, useState } from "react";
import { useQuery } from "./OwnedDocuments";
import toast from "react-hot-toast";
import { getSharedDocuments, revokeAccess } from "../api/document";
import { Modal, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import Document from "./Document";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export const formatDateFromTimestamp = (
  timestamp,
  style = { timeStyle: "short", dateStyle: "short" }
) => {
  if (!timestamp) return "Invalid DateTime"
  return new Intl.DateTimeFormat("en-BD", {
    ...style,
    timeZone: "Asia/Dhaka",
    hourCycle: "h12",
  }).format(new Date(timestamp));
};

export default function SharedByMe() {
  const [query, location] = useQuery();
  const history = useHistory();
  const page = (Number.parseInt(query.get("page")) || 1) - 1;

  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({ first: true, last: true });

  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    toast.promise(
      getSharedDocuments(page).then((res) => {
        setDocuments(res.content);
        setPagination({ first: res.first, last: res.last });
      }),
      {
        loading: "Loading documents",
        success: "Loaded documents",
        error: "Failed loading documents",
      }
    );
  }, [page]);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Shared Doucuments </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Documents
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Shared
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title float-right">Documents</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Document Name </th>
                      <th> Document Type </th>
                      {/* <th> Creation Date </th> */}
                      <th> Upload Date </th>
                      {/* <th> Uploaded By </th> */}
                      <th> Security </th>
                      <th> Collection </th>
                      <th> Shared By </th>
                      <th> Shared To </th>
                      <th> Share Date </th>
                      <th> Revoke </th>
                      <th> Actions </th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((share) => (
                      <tr key={share.id}>
                        <td>{share.document.name}</td>
                        <td>{share.document.type}</td>
                        {/* <td>
                          {formatDateFromTimestamp(share.document.creationTime)}
                        </td> */}
                        <td>
                          {formatDateFromTimestamp(share.document.uploadTime)}
                        </td>
                        <td>
                          {share.aesKey ? (
                            <label className="badge badge-gradient-success">
                              Secured
                            </label>
                          ) : (
                            <label className="badge badge-gradient-warning">
                              Not Secured
                            </label>
                          )}
                        </td>
                        <td>{share.document.collection?.name}</td>
                        <td>{share.sharedBy.username}</td>
                        <td>{share.sharedTo.username}</td>
                        <td>{formatDateFromTimestamp(share.shareTime)}</td>
                        <td>
                          {share.revokeTime ? (
                            <label className="badge badge-gradient-danger">
                              {formatDateFromTimestamp(share.revokeTime)}
                            </label>
                          ) : (
                            <button
                              className="btn btn-outline-danger btn-rounded btn-icon"
                              onClick={(e) => {
                                e.preventDefault();
                                toast.promise(
                                  revokeAccess(share.id).then((res) => {
                                    setDocuments(
                                      documents.map((d) => {
                                        if (d.id === share.id)
                                          d.revokeTime = new Date().getTime();
                                        return d;
                                      })
                                    );
                                  }),
                                  {
                                    loading: "Revoking access",
                                    success: "Revoked access",
                                    error: "Failed revoking access",
                                  }
                                );
                              }}
                            >
                              {" "}
                              <i className="mdi mdi-close"></i>{" "}
                            </button>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-secondary btn-rounded btn-icon"
                            onClick={(e) => {
                              setSelectedDocument(share.document);
                            }}
                          >
                            <i className="mdi mdi-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="float-right mt-5">
                  <button
                    className={
                      "btn btn-outline-dark btn-rounded btn-icon mx-1 my-auto" +
                      (pagination.first ? " d-none" : "")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      history.push(`/user/shared?page=${page}`);
                    }}
                  >
                    {" "}
                    <i className="mdi mdi-menu-left-outline"></i>{" "}
                  </button>
                  <button
                    className={
                      "btn btn-outline-dark btn-rounded btn-icon mx-1 my-auto" +
                      (pagination.last ? " d-none" : "")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      history.push(`/user/shared?page=${page + 2}`);
                    }}
                  >
                    {" "}
                    <i className="mdi mdi-menu-right-outline"></i>{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={selectedDocument !== null}
        onHide={() => setSelectedDocument(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Document Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocument && (
            <Document document={selectedDocument} dialog={true} />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
