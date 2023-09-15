import { useRef } from "react";
import toast from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import { validate } from "./validate";
import { register } from "../api/auth";
import { Button } from "react-bootstrap";

export default function Register() {
  const history = useHistory();

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleRegister = () => {
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    const err = validate({ username, email, password });
    
    if (err) {
      toast.error(err);
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      const toastId = toast.loading("Registering", { duration: 5000 });
      register(username, email, password).then((res) => {
        toast.dismiss(toastId);
        history.push("/auth/login");
        toast.success("Check your mail for account confiramtion", {duration: 5000});
      }).catch(err => {
        toast.dismiss(toastId);
        toast.error("Registration failed! Try again later.")
      })
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
              <h4>New here?</h4>
              <h6 className="font-weight-light">
                Signing up is easy. It only takes a few steps
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
                    type="email"
                    className="form-control form-control-lg"
                    ref={emailRef}
                    placeholder="Email"
                  />
                </div>
                {/* <div className="form-group">
                  <select
                    className="form-control form-control-lg"
                    id="exampleFormControlSelect2"
                  >
                    <option>Country</option>
                    <option>United States of America</option>
                    <option>United Kingdom</option>
                    <option>India</option>
                    <option>Germany</option>
                    <option>Argentina</option>
                  </select>
                </div> */}
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
                {/* <div className="mb-4">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input" />
                      <i className="input-helper"></i>I agree to all Terms &
                      Conditions
                    </label>
                  </div>
                </div> */}
                <div className="mt-3">
                  <Button
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    onClick={handleRegister}
                  >
                    SIGN UP
                  </Button>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Already have an account?{" "}
                  <Link to="/user-pages/login" className="text-primary">
                    Login
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
