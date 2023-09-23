import React, { Component, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { UserContext } from "../App";
import { getProfile } from "../api/user";

function UserSideBar(props) {
  const [state, setState] = useState({});
  const { user } = React.useContext(UserContext);

  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    console.log("user: ", user);
    if (user?.role === "ROLE_USER") {
      getProfile().then((res) => {
        setImageURL(res.imageURL);
      });
    }
  }, [user?.username]);

  const toggleMenuState = (menuState) => {
    if (state[menuState]) {
      setState({ [menuState]: false });
    } else if (Object.keys(state).length === 0) {
      setState({ [menuState]: true });
    } else {
      Object.keys(state).forEach((i) => {
        setState({ [i]: false });
      });
      setState({ [menuState]: true });
    }
  };

  useEffect(() => {
    const body = document.querySelector("body");
    document.querySelectorAll(".sidebar .nav-item").forEach((el) => {
      el.addEventListener("mouseover", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.add("hover-open");
        }
      });
      el.addEventListener("mouseout", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.remove("hover-open");
        }
      });
    });
  }, []);

  useEffect(() => {
    document.querySelector("#sidebar").classList.remove("active");
    Object.keys(state).forEach((i) => {
      setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: "/user/assistance", state: "assistanceMenuOpen" },
      { path: "/user/documents", state: "documentsMenuOpen" },
    ];

    dropdownPaths.forEach((obj) => {
      if (isPathActive(obj.path)) {
        setState({ [obj.state]: true });
      }
    });
  }, [props.location]);

  const isPathActive = (path) => {
    return props.location.pathname.startsWith(path);
  };

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a
            href="!#"
            className="nav-link"
            onClick={(evt) => evt.preventDefault()}
          >
            <div className="nav-profile-image">
              <img
                src={
                  imageURL || require("../../assets/images/faces/face1.jpg")
                }
                alt="profile"
              />
              <span className="login-status online"></span>{" "}
              {/* change to offline or busy as needed */}
            </div>
            <div className="nav-profile-text">
              <span className="font-weight-bold mb-2">
                {user?.username || "User"}
              </span>
              <span className="text-secondary text-small">Site User</span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </a>
        </li>
        <li
          className={
            isPathActive("/user/dashboard") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/user/dashboard">
            <span className="menu-title">Dashboard</span>
            <i className="mdi mdi-home menu-icon"></i>
          </Link>
        </li>
        <li
          className={
            isPathActive("/user/assistance") ? "nav-item active" : "nav-item"
          }
        >
          <div
            className={
              state.assistanceMenuOpen ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => toggleMenuState("assistanceMenuOpen")}
            data-toggle="collapse"
          >
            <span className="menu-title">Assistance</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-assistant menu-icon"></i>
          </div>
          <Collapse in={state.assistanceMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/assistance/symptom-checker")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/assistance/symptom-checker"
                >
                  Symptom Checker
                </Link>
              </li>
              {/* <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/assistance/symptom-checker-pro")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/assistance/symptom-checker-pro"
                >
                  Symptom Checker - Pro
                </Link>
              </li> */}
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/assistance/analysis")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/assistance/anlysis"
                >
                  Report Analysis
                </Link>
              </li>
              {/* <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/assistance/skin-care")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/assistance/skin-care"
                >
                  Skin Care
                </Link>
              </li> */}
            </ul>
          </Collapse>
        </li>
        <li
          className={
            isPathActive("/user/collections") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/user/collections">
            <span className="menu-title">Collections</span>
            <i className="mdi mdi-folder-file menu-icon"></i>
          </Link>
        </li>
        <li
          className={
            isPathActive("/user/documents") ? "nav-item active" : "nav-item"
          }
        >
          <div
            className={
              state.documentsMenuOpen ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => toggleMenuState("documentsMenuOpen")}
            data-toggle="collapse"
          >
            <span className="menu-title">Documents</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-file-document menu-icon"></i>
          </div>
          <Collapse in={state.documentsMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/documents/add")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/documents/add"
                >
                  Upload
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/documents/view")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/documents/view"
                >
                  View
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/documents/accept")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/documents/accept"
                >
                  Accept
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li
          className={
            isPathActive("/user/shared") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/user/shared">
            <span className="menu-title">Shared Documents</span>
            <i className="mdi mdi-share menu-icon"></i>
          </Link>
        </li>
        <li
          className={
            isPathActive("/user/logs") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/user/logs">
            <span className="menu-title">Logs</span>
            <i className="mdi mdi-text-long menu-icon"></i>
          </Link>
        </li>
        <li
          className={
            isPathActive("/user/settings") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/user/settings">
            <span className="menu-title">Settings</span>
            <i className="mdi mdi-cog menu-icon"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default withRouter(UserSideBar);
