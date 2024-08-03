import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { RecoilRoot } from "recoil";
import axios from "axios";
import React from "react";
import Loader from "./components/Loader";
import AuthConditionalRouter from "./components/AuthenticatedRoute";
import DashboardWrapper from "./components/DashboardWrapper";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const App = () => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <React.Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/sign-in" element={<AuthConditionalRouter auth={false}><SignIn /></AuthConditionalRouter>} />
            <Route path="/sign-up" element={<AuthConditionalRouter auth={false}><SignUp /></AuthConditionalRouter>} />
            <Route
              path="/dashboard"
              element={
                <AuthConditionalRouter auth={true}>
                  <DashboardWrapper />
                </AuthConditionalRouter>
              }
            />
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                  <Footer />
                </>
              }
            />
            <Route path="*" element={<Navigate to="/" replace/>} />
          </Routes>
      <ToastContainer />
        </React.Suspense>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
