import React, { useEffect, useState } from "react";
import { Alert, ProgressBar } from "react-bootstrap";
// import {Bar, Doughnut} from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import { getProfile, updateEmergencyProfile } from "../api/user";
import toast from "react-hot-toast";
import { formatDateFromTimestamp } from "./SharedByMe";
import ReactMarkdown from "react-markdown";
import "@mdxeditor/editor/style.css";
import { MDXEditor } from "@mdxeditor/editor/MDXEditor";
import { UndoRedo } from "@mdxeditor/editor/plugins/toolbar/components/UndoRedo";
import { BoldItalicUnderlineToggles } from "@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles";
import { toolbarPlugin } from "@mdxeditor/editor/plugins/toolbar";
import { headingsPlugin } from "@mdxeditor/editor/plugins/headings";
import {
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  ListsToggle,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  tablePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import { uploadImage } from "../api/external";
import { validateKeys } from "../common/public-private-encryption";

// import "react-datepicker/dist/react-datepicker.css";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [markdown, setMarkdown] = useState("");

  const [notification, setNotifications] = useState({
    text: "Generate public and private keys to enable others to share secured documents with you.",
    type: "info",
  });

  const markdownRef = React.useRef(null);

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
        error: "Failed loading profile",
      }
    );
  }, []);
  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Profile{" "}
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
            <div className="col-md-12 stretch-card grid-margin">
              <div className="card bg-gradient-dark card-img-holder text-white">
                <div className="card-body">
                  <img
                    src={
                      require("../../assets/images/dashboard/circle.svg")
                        .default
                    }
                    className="card-img-absolute"
                    alt="circle"
                  />
                  <img
                    src={profile.imageURL}
                    className="rounded-circle mb-3 mr-3 center-cropped"
                    style={{
                      maxHeight: "8rem",
                      maxWidth: "8rem",
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                    }}
                    alt="circle"
                  />
                  <h4 className="font-weight-normal mb-3">
                    {profile.user.username} ({profile.user.email})
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
          <Alert variant={notification.type} className="mb-5">
            <Alert.Heading className="my-2">Security Information</Alert.Heading>
            <p>{notification.text}</p>
          </Alert>
          <div className="row">
            <div className={`col-md-12 grid-margin stretch-card`}>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">
                    Emergency Details
                    {!editMode ? (
                      <button
                        className="btn btn-sm btn-gradient-info float-right"
                        onClick={(e) => {
                          setEditMode(true);
                          setMarkdown(profile.emergencyProfile);
                        }}
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-gradient-success float-right"
                          onClick={(e) => {
                            const markdownText =
                              markdownRef.current?.getMarkdown();
                            if (markdownText !== undefined)
                              toast.promise(
                                updateEmergencyProfile(markdownText).then(
                                  (res) => {
                                    setEditMode(false);
                                    setProfile({
                                      ...profile,
                                      emergencyProfile: markdownText,
                                    });
                                  }
                                ),
                                {
                                  loading: "Saving emergency profile",
                                  success: "Saved emergency profile",
                                  error: "Failed saving emergency profile",
                                }
                              );
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-gradient-danger float-right"
                          onClick={(e) => {
                            setEditMode(false);
                            setMarkdown("");
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </h4>
                  <hr />
                  {editMode ? (
                    <MDXEditor
                      markdown={markdown}
                      ref={markdownRef}
                      plugins={[
                        headingsPlugin(),
                        listsPlugin(),
                        imagePlugin({ imageUploadHandler: uploadImage }),
                        linkPlugin(),
                        tablePlugin(),
                        linkDialogPlugin(),
                        thematicBreakPlugin(),
                        toolbarPlugin({
                          toolbarContents: () => (
                            <>
                              {" "}
                              <UndoRedo />
                              <BoldItalicUnderlineToggles />
                              <BlockTypeSelect />
                              <ListsToggle />
                              <CreateLink />
                              <InsertImage />
                              <InsertTable />
                            </>
                          ),
                        }),
                      ]}
                    />
                  ) : (
                    <ReactMarkdown children={profile.emergencyProfile} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserProfile;
