import { useEffect, useRef, useState } from "react";
import { generateKeys, validateKeys } from "./public-private-encryption";
import toast from "react-hot-toast";
import { Form } from "react-bootstrap";
import { save } from "./download";
import {
  getUserDetails,
  updatePassword,
  updatePublicKey,
  updateUsernameEmail,
} from "../api/security-settings";
import { validate } from "../user-pages/validate";

export default function SecuritySettings() {
  const [key, setKey] = useState({
    privateKey: localStorage.getItem("privateKey"),
    publicKey: "",
  });

  const usernameRef = useRef();
  const emailRef = useRef();
  const oldPasswordRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    (async () => {
      const toastId = toast.loading("Loading...");
      try {
        const user = await getUserDetails();
        toast.dismiss(toastId);
        usernameRef.current.value = user.username;
        emailRef.current.value = user.email;
        setKey({ ...key, publicKey: user.publicKey });
      } catch (e) {
        toast.dismiss(toastId);
        toast.error("Failed to load user details");
      }
    })();
  }, []);

  const generatePubPrivKey = () => {
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
      <div className="page-header">
        <h3 className="page-title"> Security Setting </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              Change
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Settings</h4>
              <p className="card-description"> Information </p>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="userEmail">Email </label>
                    <input
                      ref={emailRef}
                      type="email"
                      className="form-control"
                      placeholder="Email"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="userName">Username </label>
                    <input
                      type="text"
                      className="form-control"
                      ref={usernameRef}
                      placeholder="Username"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 text-right">
                  <button
                    className="btn btn-primary mr-2"
                    onClick={(e) => {
                      (async () => {
                        const toastId = toast.loading("Updating...");
                        try {
                          const err = validate({
                            username: usernameRef.current.value,
                            email: emailRef.current.value,
                          });

                          if (err) {
                            toast.dismiss(toastId);
                            toast.error(err);
                            return;
                          }

                          await updateUsernameEmail(
                            usernameRef.current.value,
                            emailRef.current.value
                          );
                          toast.dismiss(toastId);
                          toast.success("Updated successfully");
                        } catch (e) {
                          toast.dismiss(toastId);
                          toast.error("Failed to update");
                        }
                      })();
                    }}
                  >
                    {" "}
                    Update Information{" "}
                  </button>
                </div>
              </div>

              <p className="card-description"> Password </p>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="userOldPassword">Old Password </label>
                    <input
                      type="password"
                      className="form-control"
                      ref={oldPasswordRef}
                      placeholder="Password"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="userNewPassword">New Password </label>
                    <input
                      type="password"
                      className="form-control"
                      ref={passwordRef}
                      placeholder="Password"
                    />
                  </div>
                </div>
              </div>
              {/* Confirm Password */}
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="userConfirmPassword">
                      Confirm Password{" "}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      ref={confirmPasswordRef}
                      placeholder="Password"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 text-right">
                  <button
                    className="btn btn-primary mr-2"
                    onClick={(e) => {
                      (async () => {
                        const toastId = toast.loading("Updating...");
                        try {
                          if (
                            passwordRef.current.value !==
                            confirmPasswordRef.current.value
                          ) {
                            toast.dismiss(toastId);
                            toast.error("Passwords do not match");
                            return;
                          }

                          const err = validate({
                            password: passwordRef.current.value,
                            confirmPassword: confirmPasswordRef.current.value,
                          });

                          if (err) {
                            toast.dismiss(toastId);
                            toast.error(err);
                            return;
                          }

                          await updatePassword(
                            oldPasswordRef.current.value,
                            passwordRef.current.value
                          );
                          toast.dismiss(toastId);
                          toast.success("Updated successfully");
                        } catch (e) {
                          toast.dismiss(toastId);
                          toast.error("Failed to update");
                        }
                      })();
                    }}
                  >
                    {" "}
                    Update Password{" "}
                  </button>
                </div>
              </div>

              {/* public key */}
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
                    className="btn btn-success mr-2"
                    onClick={generatePubPrivKey}
                  >
                    {" "}
                    Generate New And Download Private Key
                  </button>
                  <button
                    className="btn btn-primary mr-2"
                    onClick={(e) => {
                      (async () => {
                        if (!key.publicKey) {
                          toast.error("Please generate keys first");
                          return;
                        }
                        if (!validateKeys(key.privateKey, key.publicKey)) {
                          toast.error("Private key does not match public key");
                          return;
                        }
                        try {
                          await updatePublicKey(key.publicKey);
                          localStorage.setItem("privateKey", key.privateKey);
                        } catch (e) {
                          toast.error("Failed to save keys");
                          return;
                        }
                        toast.success("Keys saved successfully");
                      })();
                    }}
                    disabled={!key.publicKey || !key.privateKey}
                  >
                    {" "}
                    Save{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
