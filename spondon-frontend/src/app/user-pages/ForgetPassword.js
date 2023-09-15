import { useRef } from "react";
import { Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { validate } from "./validate";
import toast from "react-hot-toast";
import { forgetPassword, resetPassword } from "../api/auth";

export function LockScreen() {
  // check if query param is present
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const history = useHistory();
  const inputRef = useRef();
  const confirmRef = useRef();

  // Take Email as input
  if (!token)
    return (
      <div>
        <div className="content-wrapper d-flex align-items-center auth h-100">
          <div className="row w-100 align-items-center">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-transparent text-left p-5 text-center">
                <div className="brand-logo">
                  <img
                    src={require("../../assets/images/logo.svg").default}
                    alt="logo"
                  />
                </div>
                <h4 className="mb-5">Enter your email address!</h4>
                <form className="">
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control text-center"
                      placeholder="Email"
                      ref={inputRef}
                    />
                  </div>
                  <div className="mt-5">
                    <Button
                      className="btn btn-block btn-success btn-lg font-weight-medium"
                      onClick={(e) => {
                        const email = inputRef.current.value;
                        const err = validate({ email });
                        if (err) {
                          toast.error(err);
                        } else {
                          const toastId = toast.loading(
                            "Sending password reset request..."
                          );
                          forgetPassword(email)
                            .then((res) => {
                              toast.dismiss(toastId);
                              toast.success(
                                "Password reset request sent successfully! Check your mail for further instructions."
                              );
                              history.push("/auth/login");
                            })
                            .catch((err) => {
                              toast.dismiss(toastId);
                              toast.error(
                                "Password reset request failed! Try again later."
                              );
                            });
                        }
                      }}
                    >
                      Request Password Reset
                    </Button>
                  </div>
                  <div className="mt-3 text-center">
                    <Link to="/auth/login" className="auth-link text-white">
                      Sign in using a different account
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  else
    return (
      <div>
        <div className="content-wrapper d-flex align-items-center auth h-100">
          <div className="row w-100 align-items-center">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-transparent text-left p-5 text-center">
                <div className="brand-logo">
                  <img
                    src={require("../../assets/images/logo.svg").default}
                    alt="logo"
                  />
                </div>
                <h4 className="mb-5">Add new password!</h4>
                <form className="">
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control text-center"
                      ref={inputRef}
                      placeholder="Password"
                    />{" "}
                    <br />
                    <input
                      type="password"
                      ref={confirmRef}
                      className="form-control text-center"
                      placeholder="Confirm Password"
                    />
                  </div>
                  <div className="mt-5">
                    <Button
                      className="btn btn-block btn-success btn-lg font-weight-medium"
                      onClick={(e) => {
                        const password = inputRef.current.value
                        const confirmPassword = confirmRef.current.value
                        const err = validate({password})
                        if (err) {
                          toast.error(err);
                        } else if (password !== confirmPassword) {
                          toast.error("Passwords do not match");
                        } else {
                          const toastId = toast.loading(
                            "Updating password..."
                          );
                          resetPassword(token, password).then(res => {
                            toast.dismiss(toastId);
                            toast.success("Password updated successfully! Login to continue...");
                            history.push("/auth/login");
                          }).then(err => {
                            toast.dismiss(toastId);
                            toast.error("Password update failed! Try again later...");
                          })
                        }

                      }}
                    >
                      Update
                    </Button>
                  </div>
                  <div className="mt-3 text-center">
                    <Link to="/auth/login" className="auth-link text-dark">
                      Sign in using a different account
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default LockScreen;
