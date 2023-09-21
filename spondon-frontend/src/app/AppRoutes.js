import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Spinner from "../app/shared/Spinner";
import { useContext } from "react";
import { UserContext } from "./App";

const Dashboard = lazy(() => import("./dashboard/Dashboard"));

const Login = lazy(() => import("./user-pages/Login"));
const Register = lazy(() => import("./user-pages/Register"));
const ForgetPassword = lazy(() => import("./user-pages/ForgetPassword"));
const Activate = lazy(() => import("./user-pages/Activate"));
const ActivateDoctor = lazy(() => import("./user-pages/RegisterDoctor"));

const SecuritySettings = lazy(() => import("./common/SecuritySettings"));

const UserHome = lazy(() => import("./user/Dashboard"));
const AddDocument = lazy(() => import("./common/UploadDocument"));
const ViewDocuments = lazy(() => import("./user/OwnedDocuments"));
const PendingDocuments = lazy(() => import("./user/NotAcceptedDocuments"));
const Collections = lazy(() => import("./user/Collections"));
const SharedByMe = lazy(() => import("./user/SharedByMe"));

const AdminHome = lazy(() => import("./admin/Dashboard"));
const AddDoctor = lazy(() => import("./admin/AddDoctor"));

const DoctorHome = lazy(() => import("./doctor/Dashboard"));
const SharedWithMe = lazy(() => import("./doctor/SharedWithMe"));
const UploadedByDoctor = lazy(() => import("./doctor/UploadedByDoctor"));

export default function AppRoutes() {
  const { user } = useContext(UserContext);

  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        {user && (
          <Switch>
            <Route path="/security-settings" component={SecuritySettings} />

            {user?.role === "ROLE_USER" && (
              <Switch>
                <Route path="/user/dashboard" component={UserHome} />
                <Route path="/user/documents/add" component={AddDocument} />
                <Route path="/user/documents/view" component={ViewDocuments} />
                <Route
                  path="/user/documents/accept"
                  component={PendingDocuments}
                />
                <Route path="/user/collections" component={Collections} exact />
                <Route path="/user/collections/:id" component={Collections} />
                <Route path="/user/shared" component={SharedByMe} />
                <Redirect to="/user/dashboard" />
              </Switch>
            )}

            {user?.role === "ROLE_ADMIN" && (
              <Switch>
                <Route path="/admin/dashboard" component={AdminHome} />
                <Route path="/admin/add-doctor" component={AddDoctor} />
                <Redirect to="/admin/dashboard" />
              </Switch>
            )}

            {user?.role === "ROLE_DOCTOR" && (
              <Switch>
                <Route path="/doctor/dashboard" component={DoctorHome} />
                <Route path="/doctor/documents/add" component={AddDocument} />
                <Route path="/doctor/documents/view" component={SharedWithMe} />
                <Route path="/doctor/documents/uploaded" component={UploadedByDoctor} />
                <Route path="/doctor/collections" component={Collections} exact />
                <Route path="/doctor/collections/:id" component={Collections} />
                <Redirect to="/doctor/dashboard" />
              </Switch>
            )}
          </Switch>
        )}

        {!user && (
          <Switch>
            <Route path="/auth/login" component={Login} />
            <Route path="/auth/register" component={Register} />
            <Route path="/auth/forget-password" component={ForgetPassword} />
            <Route path="/auth/activate/:token" component={Activate} />
            <Route path="/auth/doctor/:token" component={ActivateDoctor} />
            <Redirect to="/auth/login" />
          </Switch>
        )}
      </Switch>
    </Suspense>
  );
}
