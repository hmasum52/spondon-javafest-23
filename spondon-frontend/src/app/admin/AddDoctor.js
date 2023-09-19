import { useRef } from "react";
import { Button } from "react-bootstrap";
import { validate } from "../user-pages/validate";
import toast from "react-hot-toast";
import { addDoctorRequest } from "../api/admin";

export default function AddDoctor() {
  const inputRef = useRef();

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Add New Doctor </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Doctor
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add
            </li>
          </ol>
        </nav>
      </div>

      {/* big card */}
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Send Email to doctors email</h4>
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
                      toast.promise(addDoctorRequest(email), {
                        loading: "Sending Email",
                        success: "Email Sent",
                        error: "Failed sending email",
                      });
                    }
                  }}
                >
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
