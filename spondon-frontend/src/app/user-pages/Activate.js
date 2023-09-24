import { useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Link, useParams, useHistory } from "react-router-dom";
import { uploadImage } from "../api/external";
import toast from "react-hot-toast";
import { Button, Col, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { activate } from "../api/auth";

export default function Activate() {
  const { token } = useParams();
  const history = useHistory();
  const [imageURL, setImageUrl] = useState("");

  const nameRef = useRef();
  const birthRef = useRef();
  const bloodRef = useRef();
  const aboutRef = useRef();
  const birthCertRef = useRef();

  const handleSubmit = (e) => {
    try {
      const name = nameRef.current.value;
      const dateOfBirth = birthRef.current.value;
      const bloodGroup = bloodRef.current.selectedOptions[0].value;
      const about = aboutRef.current.value;
      const birthCertificateNumber = birthCertRef.current.value;

      if (!name || !dateOfBirth || !birthCertificateNumber) {
        throw new Error(
          `Please fill Name, Date of Birth and Birth Certificate Number`
        );
      }

      const userInfo = {
        name,
        dateOfBirth,
        bloodGroup,
        about,
        birthCertificateNumber: parseInt(birthCertificateNumber),
        imageURL,
      };

      const toastId = toast.loading("Activating account...");
      activate(token, userInfo)
        .then((e) => {
          toast.dismiss(toastId);
          toast.success(
            "Account activated successfully! Log in to continue..."
          );
          history.push("/auth/login");
        })
        .catch((e) => {
          toast.dismiss(toastId);
          toast.error("Account activation failed! Try again later...");
        });
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
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
                    ref={nameRef}
                    placeholder="Name"
                  />
                </div>
                <div class="d-flex justify-content-between mb-3">
                  {imageURL && (
                    <img
                      src={imageURL}
                      alt="Profile"
                      className="rounded-circle mr-2 center-cropped"
                    />
                  )}
                  <FileUploader
                    classes="flex-grow-1 my-auto"
                    label="Upload or drop your profile picture here"
                    handleChange={(file) => {
                      const toastId = toast.loading("Uploading image...");
                      uploadImage(file)
                        .then((url) => {
                          toast.dismiss(toastId);
                          toast.success("Image uploaded successfully!");
                          setImageUrl(url);
                        })
                        .catch((e) => {
                          console.log(e);
                          toast.dismiss(toastId);
                          toast.error("Image upload failed!");
                        });
                    }}
                    name="file"
                    types={["JPG", "JPEG", "PNG", "BMP"]}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    ref={birthCertRef}
                    placeholder="Birth Certificate Number"
                  />
                </div>
                <div className="form-group">
                  <Form.Control
                    type="date"
                    className="form-control form-control-lg"
                    ref={birthRef}
                    placeholder="Date of Birth"
                    title="Date of Birth"
                  />
                </div>
                <div className="form-group text-dark">
                  <select
                    className="form-control form-control-lg"
                    ref={bloodRef}
                    selected=""
                  >
                    <option hidden value="">
                      Blood Group
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O-">O-</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>About Yourself</Form.Label>
                  <Form.Control as="textarea" rows={4} ref={aboutRef} />
                </Form.Group>

                <div className="mt-3">
                  <Button
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    onClick={handleSubmit}
                  >
                    Activate Account
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
