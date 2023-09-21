import React, { useEffect, useState } from "react";
import { Alert, ProgressBar } from "react-bootstrap";
// import {Bar, Doughnut} from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { getProfile } from "../api/doctor";
import { validateKeys } from "../common/public-private-encryption";

// import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [profile, setProfile] = useState(null);
  const [notification, setNotifications] = useState({
    text: "Generate public and private keys to enable others to share secured documents with you.",
    type: "info",
  });

  useEffect(() => {
    toast.promise(
      getProfile().then((res) => {
        setProfile(res);
        const privateKey = localStorage.getItem("privateKey");
        if (!res?.user?.publicKey) {
          setNotifications({
            text: "You have not generated a public-private key. Please generate a key pair to enable others to share secured documents with you.",
            type: "warning",
          });
        } else if (res?.user?.publicKey && !privateKey) {
          setNotifications({
            text: "You have not saved a private key. Please save private key in your security settings to view end to end encrypted documents.",
            type: "warning",
          });
        } else if (!validateKeys(privateKey, res?.user?.publicKey)) {
          setNotifications({
            text: "Your private key does not match your public key. Please save the correct private key in your security settings to view end to end encrypted documents.",
            type: "warning",
          });
        } else {
          setNotifications({
            text: "Your account is secured with a private key. Please do not share your private key with anyone.",
            type: "success",
          });
        }
      }),
      {
        loading: "Loading profile",
        success: "Loaded profile",
        error: "Failed to load profile",
      }
    );
  }, []);

  const secured = profile && profile.user.publicKey;

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Dashboard{" "}
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Overview{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>
      </div>
      {profile && (
        <>
          <div className="row">
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-danger card-img-holder text-white">
                <div className="card-body">
                  <img
                    src={
                      require("../../assets/images/dashboard/circle.svg")
                        .default
                    }
                    className="card-img-absolute"
                    alt="circle"
                  />
                  <h4 className="font-weight-normal mb-3">
                    Hello [{profile.user.username}]
                    <i className="mdi mdi-account mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">{profile.name}</h2>
                  <h6 className="card-text">{profile.user.email}</h6>
                </div>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-info card-img-holder text-white">
                <div className="card-body">
                  <img
                    src={
                      require("../../assets/images/dashboard/circle.svg")
                        .default
                    }
                    className="card-img-absolute"
                    alt="circle"
                  />
                  <h4 className="font-weight-normal mb-3">
                    Education{" "}
                    <i className="mdi mdi-chart-line mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">{profile.education}</h2>
                  <h6 className="card-text">
                    Reg # {profile.registrationNumber}
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-success card-img-holder text-white">
                <div className="card-body">
                  <img
                    src={
                      require("../../assets/images/dashboard/circle.svg")
                        .default
                    }
                    className="card-img-absolute"
                    alt="circle"
                  />
                  <h4 className="font-weight-normal mb-3">
                    Speciality
                    <i className="mdi mdi-diamond mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">{profile.speciality}</h2>
                  <h6 className="card-text">
                    Secured Share {secured ? "ON" : "OFF"}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <Alert variant={notification.type}>
            <Alert.Heading className="mt-2">Security Information</Alert.Heading>
            <p>{notification.text}</p>
          </Alert>
        </>
      )}
    </div>
  );
}

export default App;
