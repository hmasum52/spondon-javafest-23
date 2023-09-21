import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";
import { uploadImage } from "../api/external";
import { getProfile, updateProfile } from "../api/doctor";
import { dateFromTimestamp } from "../common/UploadDocument";

export default function DoctorSettings() {
  const nameRef = useRef();
  const registrationNumberRef = useRef();
  const specialityRef = useRef();
  const educationRef = useRef();

  useEffect(() => {
    toast.promise(
      getProfile().then((res) => {
        if (nameRef.current) nameRef.current.value = res.name;
        if (specialityRef.current) specialityRef.current.value = res.speciality;
        if (educationRef.current) educationRef.current.value = res.education;
        if (registrationNumberRef.current)
          registrationNumberRef.current.value = res.registrationNumber;
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
                    const education = educationRef.current.value;
                    const speciality = specialityRef.current.value;
                    const registrationNumber =
                      registrationNumberRef.current.value;

                    if (!name || !education || !registrationNumber) {
                      throw new Error(
                        `Please fill Name, education and registration number`
                      );
                    }

                    const userInfo = {
                      name,
                      education,
                      speciality,
                      registrationNumber: parseInt(registrationNumber),
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
                <div className="form-group col-md-6">
                  <p className="text-muted">Registration Number</p>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    ref={registrationNumberRef}
                    placeholder="Registration Number"
                  />
                </div>
                <div className="form-group col-md-3">
                  <p className="text-muted">Education</p>
                  <Form.Control
                    type="text"
                    className="form-control form-control-lg"
                    ref={educationRef}
                    placeholder="Education"
                  />
                </div>
                <Form.Group
                  className="mb-3 col-md-12"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Speciality</Form.Label>
                  <Form.Control as="textarea" rows={4} ref={specialityRef} />
                </Form.Group>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
