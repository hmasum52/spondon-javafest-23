import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { withRouter } from "react-router-dom";
import "./App.scss";
import AppRoutes from "./AppRoutes";
import Navbar from "./shared/Navbar";
import Sidebar from "./shared/Sidebar";
import SettingsPanel from "./shared/SettingsPanel";
import Footer from "./shared/Footer";
import "./App.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { FORBIDDEN, UNAUTHORIZED } from "./api";
import { Toaster, toast } from "react-hot-toast";

export const UserContext = createContext({
  user: undefined,
  setUser: (u) => {},
});
export const UserProvider = UserContext.Provider;

export const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

function App() {
  const location = useLocation();
  const [isFullPageLayout, setIsFullPageLayout] = useState(false);

  const [user, setUser] = useState(parseJwt(localStorage.getItem("token")));

  console.log("user: ", user);

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;

      if (status === UNAUTHORIZED || status === FORBIDDEN) {
        localStorage.removeItem("token");
        setUser(null);
        toast.error("Please login again.");
        return new Promise(() => {});
      } 
      // else {
      //   const message = error?.response?.data || "Failed";
      //   toast.error(message);
      // }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    onRouteChanged(location);
  }, [location]);

  function onRouteChanged(location) {
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ["/auth/", "/form/"];
    const isFullPageLayout = fullPageLayoutRoutes.some((l) =>
      location.pathname.startsWith(l)
    );
    console.log("isFullPageLayout: ", isFullPageLayout, location.pathname);
    setIsFullPageLayout(isFullPageLayout);

    if (isFullPageLayout) {
      document
        .querySelector(".page-body-wrapper")
        .classList.add("full-page-wrapper");
    } else {
      document
        .querySelector(".page-body-wrapper")
        .classList.remove("full-page-wrapper");
    }
  }

  let navbarComponent = !isFullPageLayout ? <Navbar /> : "";
  let sidebarComponent = !isFullPageLayout ? <Sidebar /> : "";
  let SettingsPanelComponent = !isFullPageLayout ? <SettingsPanel /> : "";
  let footerComponent = !isFullPageLayout ? <Footer /> : "";

  return (
    <UserProvider value={{ user: user, setUser }}>
      <div className="container-scroller">
        {navbarComponent}
        <div className={"container-fluid page-body-wrapper"}>
          {sidebarComponent}
          <div className="main-panel">
            <div className="content-wrapper">
              <AppRoutes />
              {SettingsPanelComponent}
            </div>
            {footerComponent}
          </div>
        </div>
      </div>
    </UserProvider>
  );
}

export default App;
