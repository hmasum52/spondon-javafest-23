import { Link, useParams } from "react-router-dom";

export default function Activate() {

  const {token} = useParams();

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
              <h4>Activate your account</h4>
              <h6 className="font-weight-light">
                We need to create your profile. It only takes a few steps
              </h6>
              <form className="pt-3">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="exampleInputUsername1"
                    placeholder="Name"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    id="exampleInputUsername1"
                    placeholder="Birth Certificate Number"
                  />
                </div>
                <div className="form-group">
                  <select
                    className="form-control form-control-lg"
                    id="exampleFormControlSelect2"
                  >
                    <option hidden disabled>Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="exampleInputPassword2"
                    placeholder="Date of Birth"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="exampleInputPassword2"
                    placeholder="About Yourself"
                  />
                </div>
                
                <div className="mt-3">
                  <Link
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    to="/dashboard"
                  >
                    SIGN UP
                  </Link>
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

