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

const SecuritySettings = lazy(() => import("./common/SecuritySettings"));

const UserHome = lazy(() => import("./user/Dashboard"));
const AddDocument = lazy(() => import("./common/UploadDocument"));

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
                <Redirect to="/user/dashboard" />
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
            <Redirect to="/auth/login" />
          </Switch>
        )}
      </Switch>
    </Suspense>
  );
}
