import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useRef } from "react";
import toast from "react-hot-toast";
import { login } from "../api/auth";
import { useContext } from "react";
import { UserContext, parseUserFromJwt } from "../App";
import { validate } from "./validate";

export const USERNAME_DETAILS =
  "Username must be between 6 and 30 characters long and can only contain alphanumeric characters and underscores, starting with an alphabet.";
export const USERNAME_REGEX = /^[a-zA-Z]\w{5,29}$/;

export const PASSWORD_DETAILS =
  "Password must be between 8 and 20 characters long.";
export const PASSWORD_REGEX = /^.{8,20}$/;

export const EMAIL_DETAILS = "Email must be a valid email address.";
export const EMAIL_REGEX =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export function Login() {
  const { setUser } = useContext(UserContext);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleLogin = () => {
    const usernameValue = usernameRef.current.value;
    const passwordValue = passwordRef.current.value;

    const err = validate({ username: usernameValue, password: passwordValue });

    if (err) {
      toast.error(err);
    } else {
      const toastId = toast.loading("Logging in...", { duration: 5000 });
      login(usernameValue, passwordValue)
        .then((res) => {
          toast.dismiss(toastId);
          toast.success("Logged in successfully!");
          console.log(res);
          localStorage.setItem("token", res.jwt);
          setUser(parseUserFromJwt(res.jwt));
        })
        .catch((err) => {
          toast.dismiss(toastId);
          toast.error("Login failed!");
        });
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img
                  src={require("../../assets/images/logo.svg").default}
                  alt="logo"
                />
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <Form className="pt-3">
                <Form.Group className="d-flex search-field">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    size="lg"
                    className="h-auto"
                    ref={usernameRef}
                  />
                </Form.Group>
                <Form.Group className="d-flex search-field">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    size="lg"
                    className="h-auto"
                    ref={passwordRef}
                  />
                </Form.Group>
                <div className="mt-3">
                  <Button
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    onClick={handleLogin}
                  >
                    SIGN IN
                  </Button>
                </div>
                <div className="my-2 d-flex justify-content-between align-items-center">
                  {/* <div className="form-check"> */}
                  {/* <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input" />
                      <i className="input-helper"></i>
                      Keep me signed in
                    </label> */}
                  {/* </div> */}
                  <Link
                    to="/auth/forget-password"
                    className="auth-link text-black"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Don't have an account?{" "}
                  <Link to="/auth/register" className="text-primary">
                    Create
                  </Link>
                </div>
                <div className="mt-3">
                  <Link
                    className="btn btn-block btn-inverse-success btn-lg font-weight-medium auth-form-btn"
                    to="/verify"
                  >
                    Verify Documents
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
