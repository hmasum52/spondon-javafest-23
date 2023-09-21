import { useEffect, useRef, useState } from "react";
import { getPossibleOwners } from "../api/document";
import toast from "react-hot-toast";
import { Typeahead } from "react-bootstrap-typeahead";
import { formatDateFromTimestamp } from "../user/SharedByMe";
import ReactMarkdown from "react-markdown";
import domToPdf from "dom-to-pdf";
import { accessEmergencyProfile } from "../api/doctor";

export default function AceessEmergencyDocument() {
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    toast.promise(
      getPossibleOwners().then((users) => {
        setUsers(users);
      }),
      {
        loading: "Loading users",
        success: "Loaded users",
        error: "Failed loading users",
      }
    );
  }, []);

  const pdfRef = useRef(null);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Access Emergency Profile </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Patient
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Emergency Profile
            </li>
          </ol>
        </nav>
      </div>

      {/* <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="card">
            <div className="card-body"> */}
      {/* <h4 className="card-title float-right">Select An Patient</h4> */}
      <div className="d-flex justify-content-center mb-5">
        <div className="col-md-6">
          <label htmlFor="documentOwner">Select An Patient</label>
          <div className="d-flex justify-content-center">
            <Typeahead
              onChange={(selected) => {
                setProfile(selected[0]);
              }}
              options={users}
              labelKey={(option) =>
                `${option.name} (${option.birthCertificateNumber})`
              }
              filterBy={["name", "birthCertificateNumber"]}
              placeholder="Owner of the document..."
              className="flex-grow-1"
            />
            <button
              className="btn btn-primary my-auto"
              onClick={(e) => {
                if (!profile) {
                  toast.error("Select a profile first!");
                  return;
                }
                toast.promise(
                  accessEmergencyProfile(profile.user.username).then((res) => {
                    setProfile({
                      ...profile,
                      ...res,
                    });
                  }),
                  {
                    loading: "Accessing emergency profile",
                    success: "Accessed emergency profile",
                    error: "Failed accessing emergency profile",
                  }
                );
              }}
            >
              Access
            </button>
          </div>
        </div>
      </div>
      {/* </div>
          </div>
        </div>
      </div> */}

      {profile && (
        <>
          <div className="row mb-5">
            <div className="col-md-12 stretch-card grid-margin">
              <div className="card bg-gradient-info card-img-holder text-white">
                <div className="card-body">
                  <img
                    src={profile.imageURL}
                    className="rounded-circle mb-3 mr-3"
                    style={{
                      maxHeight: "8rem",
                      maxWidth: "8rem",
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      zIndex: "999",
                    }}
                    alt="circle"
                  />
                  <h4 className="font-weight-normal mb-3">
                    {profile.user.username}
                    <span className="float-right text-danger display-3">
                      {profile.bloodGroup}
                    </span>
                  </h4>
                  <h2 className="mb-3">{profile.name}</h2>
                  <div className="row mb-3" style={{ marginRight: "100px" }}>
                    <div className="col-md-4">
                      <p className="card-text">
                        Birth Certificate # {profile.birthCertificateNumber}
                      </p>
                    </div>
                    <div className="col-md-8">
                      <p className="card-text">
                        Date of Birth:{" "}
                        {formatDateFromTimestamp(profile.dateOfBirth, {
                          dateStyle: "full",
                        })}
                      </p>
                    </div>
                  </div>
                  <h6 className="card-text" style={{ marginRight: "100px" }}>
                    {profile.about}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          {profile.emergencyProfile && (
            <div className="row" ref={pdfRef}>
              <div className={`col-md-12 grid-margin stretch-card`} >
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">
                      Emergency Profile
                      <button
                        className="btn btn-sm btn-gradient-info float-right"
                        onClick={(e) => {
                          const element = pdfRef.current;
                          const option = {
                            filename: `emergency-profile-${profile.user.username}.pdf`,
                            overrideWidth: 800,
                            excludeTagNames: ["button"],
                          };
                          toast.promise(
                            new Promise((resolve, reject) => {
                              domToPdf(element, option, (pdf) => {
                                console.log("Done");
                                resolve();
                              });
                            }),
                            {
                              loading: "Generating PDF",
                              success: "Downloading PDF",
                              error: "Failed generating PDF",
                            }
                          );
                        }}
                      >
                        Download PDF
                      </button>
                    </h4>
                    <hr />
                    <ReactMarkdown children={profile.emergencyProfile} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
