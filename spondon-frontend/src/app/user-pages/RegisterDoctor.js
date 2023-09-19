import { useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Link, useParams, useHistory } from "react-router-dom";
import { uploadImage } from "../api/external";
import toast from "react-hot-toast";
import { Button, Col, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { activate, registerDoctor } from "../api/auth";
import { validate } from "./validate";
import {
  generateKeys,
  validateKeys,
} from "../common/public-private-encryption";
import { save } from "../common/download";

export default function ActivateDoctor() {
  const { token } = useParams();
  const history = useHistory();

  const nameRef = useRef();
  const usernameRef = useRef();
  const specialityRef = useRef();
  const educationRef = useRef();
  const registrationNoRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [key, setKey] = useState({
    privateKey: "",
    publicKey: "",
  });

  const handleSubmit = (e) => {
    try {
      const name = nameRef.current.value;
      const username = usernameRef.current.value;
      const speciality = specialityRef.current.value;
      const education = educationRef.current.value;
      const registrationNumber = registrationNoRef.current.value;
      const password = passwordRef.current.value;
      const confirmPassword = confirmPasswordRef.current.value;

      const err = validate({
        username,
        password,
      });
      if (err) throw new Error(err);

      if (password !== confirmPassword)
        throw new Error("Passwords do not match");

      if (!name) throw new Error("Please enter your name");

      if (!registrationNumber)
        throw new Error("Please enter your registration number");

      if (key.privateKey === "" || key.publicKey === "")
        throw new Error("Please generate keys");

      const info = {
        name,
        username,
        speciality,
        education,
        registrationNumber,
        password,
        publicKey: key.publicKey,
      };
      console.log(info);
      toast.promise(
        registerDoctor(token, info).then((res) => {
          history.push("/auth/login");
        }),
        {
          loading: "Activating account...",
          success: "Account activated successfully! Login to continue...",
          error: "Account activation failed! Try again later...",
        }
      );
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  const generatePubPrivKey = (e) => {
    e.preventDefault();
    const toastId = toast.loading("Generating keys...");
    const keys = generateKeys();
    toast.loading("Updating documents...", { id: toastId });
    toast.dismiss(toastId);
    setKey({ privateKey: keys.private, publicKey: keys.public });
    toast.success("Downloading your private key...");
    save("private-key.txt", keys.private, "text/plain");
  };

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-5 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img
                  src={require("../../assets/images/logo.svg").default}
                  alt="logo"
                />
              </div>
              <h4>Activate your account</h4>
              <h6 className="font-weight-light">
                We need to create your profile. It only takes a few steps
              </h6>
              <form className="pt-3">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    ref={usernameRef}
                    placeholder="Username"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    ref={passwordRef}
                    placeholder="Password"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    ref={confirmPasswordRef}
                    placeholder="Confirm Password"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    ref={nameRef}
                    placeholder="Name"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    ref={registrationNoRef}
                    placeholder="Registration Number"
                  />
                </div>
                <div className="form-group text-dark">
                  <input
                    placeholder="Speciality"
                    className="form-control form-control-lg"
                    ref={specialityRef}
                  />
                </div>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Education</Form.Label>
                  <Form.Control as="textarea" rows={4} ref={educationRef} />
                </Form.Group>

                <p className="card-description"> Key Management </p>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="userPublicKey">
                        Private Key (Saved Locally){" "}
                      </label>
                      {/* textarea */}
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Public Key"
                        value={key.privateKey}
                        onChange={(e) =>
                          setKey({ ...key, privateKey: e.target.value })
                        }
                        readOnly={!key.publicKey}
                        title={
                          key.publicKey
                            ? "Private key is saved locally"
                            : "Generate keys first"
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="userPublicKey">Public Key </label>
                      {/* textarea no-editable*/}
                      <textarea
                        className="form-control"
                        id="userPublicKey"
                        value={key.publicKey}
                        readOnly
                        rows="3"
                        placeholder="Public Key"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 text-right">
                    <button
                      className="btn btn-success mr-2 btn-block"
                      onClick={generatePubPrivKey}
                    >
                      {" "}
                      Generate New And Download Private Key
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <Button
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    onClick={handleSubmit}
                  >
                    Activate Account
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
