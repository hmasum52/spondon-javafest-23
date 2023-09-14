import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Spinner from "../app/shared/Spinner";
import { useContext } from "react";
import { UserContext } from "./App";

const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const Teachers = lazy(() => import("./database/Teachers"));

const Error404 = lazy(() => import("./error-pages/Error404"));
const Error500 = lazy(() => import("./error-pages/Error500"));

const Login = lazy(() => import("./user-pages/Login"));
const Register = lazy(() => import("./user-pages/Register"));
const ForgetPassword = lazy(() => import("./user-pages/ForgetPassword"));
const Activate = lazy(() => import("./user-pages/Activate"));
const Lockscreen = lazy(() => import("./user-pages/Lockscreen"));

const BlankPage = lazy(() => import("./general-pages/BlankPage"));

export default function AppRoutes() {
  const { user } = useContext(UserContext);

  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        {user && (
          <Switch>
            <Route path="/user/dashboard" component={Dashboard} />
            <Redirect to="/user/dashboard" />
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
