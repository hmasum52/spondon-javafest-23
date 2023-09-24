import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";
import { uploadImage } from "../api/external";
import { getProfile, updateProfile } from "../api/user";
import { dateFromTimestamp } from "../common/UploadDocument";

export default function UserSettings() {
  const [imageURL, setImageUrl] = useState("");

  const nameRef = useRef();
  const birthRef = useRef();
  const bloodRef = useRef();
  const aboutRef = useRef();
  const birthCertRef = useRef();

  useEffect(() => {
    toast.promise(
      getProfile().then((res) => {
        setImageUrl(res.imageURL);
        if (nameRef.current) nameRef.current.value = res.name;
        if (bloodRef.current) bloodRef.current.value = res.bloodGroup;
        if (aboutRef.current) aboutRef.current.value = res.about;
        if (birthRef.current)
          birthRef.current.value = dateFromTimestamp(res.dateOfBirth);
        if (birthCertRef.current)
          birthCertRef.current.value = res.birthCertificateNumber;
      }),
      {
        loading: "Loading profile",
        success: "Loaded profile",
        error: "Failed loading profile",
      }
    );
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Update Profile </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Settings
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Profile
            </li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className={`col-md-12 grid-margin stretch-card`}>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                Profile
                <button
                  className="btn btn-sm btn-gradient-success float-right"
                  onClick={(e) => {
                    const name = nameRef.current.value;
                    const dateOfBirth = birthRef.current.value;
                    const bloodGroup =
                      bloodRef.current.selectedOptions[0].value;
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
                      birthCertificateNumber: Number.parseInt(
                        birthCertificateNumber
                      ),
                      imageURL,
                    };

                    toast.promise(updateProfile(userInfo), {
                      loading: "Updating profile",
                      success: "Updated profile",
                      error: "Failed updating profile",
                    });
                  }}
                >
                  Update
                </button>
              </h4>
              <form className="pt-3 row">
                <div className="form-group col-md-6">
                  <p className="text-muted">Name</p>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    ref={nameRef}
                    placeholder="Name"
                  />
                </div>
                <div className="col-md-6">
                  <p className="text-muted">Profile Picture</p>
                  <div class="d-flex justify-content-between mb-3">
                    {imageURL && (
                      <img
                        src={imageURL}
                        className="rounded-circle mr-2 center-cropped"
                        alt="Profile"
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
                </div>
                <div className="form-group col-md-6">
                  <p className="text-muted">Birth Certificate Number</p>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    ref={birthCertRef}
                    placeholder="Birth Certificate Number"
                  />
                </div>
                <div className="form-group col-md-3">
                  <p className="text-muted">Date of Birth</p>
                  <Form.Control
                    type="date"
                    className="form-control form-control-lg"
                    ref={birthRef}
                    placeholder="Date of Birth"
                    title="Date of Birth"
                  />
                </div>
                <div className="form-group text-dark col-md-3">
                  <p className="text-muted">Blood Group</p>
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
                  className="mb-3 col-md-12"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>About Yourself</Form.Label>
                  <Form.Control as="textarea" rows={4} ref={aboutRef} />
                </Form.Group>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
