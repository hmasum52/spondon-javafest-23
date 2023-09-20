import { useEffect } from "react";
import { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { getPossibleDoctors, shareDocument } from "../api/document";
import { Typeahead } from "react-bootstrap-typeahead";
import toast from "react-hot-toast";
import {
  decryptPassword,
  encryptPassword,
} from "../common/public-private-encryption";

export default function ShareModal({ documents, setShow, show }) {
  const [selectableUsers, setSelectableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getPossibleDoctors().then((res) => setSelectableUsers(res));
  }, []);

  useEffect(() => {
    setSelectedUser(null);
  }, [show]);

  return (
    <Modal centered show={show} onHide={() => setShow(false)} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          Share {documents?.length} Document{documents?.length > 1 && "s"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label>Doctor</label>
          <Typeahead
            onChange={(selected) => {
              setSelectedUser(selected[0]);
            }}
            options={selectableUsers}
            labelKey={(option) =>
              `[${option.user.username}] ${option.name} (${option.registrationNumber})`
            }
            filterBy={["name", "registrationNumber", "user.username"]}
            placeholder="Share with..."
          />
        </div>
        {selectedUser && <p className="card-description">Doctor Details</p>}
        <div className="flex mb-4">
          {selectedUser && (
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <th>Username</th>
                  <td>{selectedUser.user.username}</td>
                  <th>Registration No.</th>
                  <td>{selectedUser.registrationNumber}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td colSpan={3}>{selectedUser.name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td colSpan={3}>{selectedUser.user.email}</td>
                </tr>
                <tr>
                  <th>Speciality</th>
                  <td>{selectedUser.speciality}</td>
                  <th>Education</th>
                  <td>{selectedUser.education}</td>
                </tr>
              </tbody>
            </Table>
          )}
          <div className="flex-grow mt-3">
            <button
              className="btn btn-outline-danger float-left"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary float-right"
              disabled={!selectedUser || !documents || documents.length === 0}
              onClick={() => {
                const privateKey = localStorage.getItem("privateKey");
                if (selectedUser) {
                  try {
                    const doctorId = selectedUser.id;
                    const doctorPublicKey = selectedUser.user.publicKey;
                    const documentIds = documents.map((document) => {
                      let aesKey = document.aesKey;
                      if (aesKey) {
                        if (!privateKey)
                          throw new Error("Private Key not found");

                        if (!doctorPublicKey)
                          throw new Error("Doctor Public Key not found");

                        aesKey = decryptPassword(aesKey, privateKey);
                        aesKey = encryptPassword(aesKey, doctorPublicKey);
                      }
                      return { id: document.id, aesKey };
                    });

                    toast.promise(
                      shareDocument(doctorId, documentIds).then((r) =>
                        setShow(false)
                      ),
                      {
                        loading: "Sharing Documents...",
                        success: "Documents Shared",
                        error: "Error Occured",
                      }
                    );
                  } catch (e) {
                    toast.error(e.message);
                  }
                } else {
                  toast.error("Please select a doctor");
                }
              }}
            >
              Share
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
