import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { usernameValidate } from "../helper/validate";
import { useAuthStore } from "../store/store";
import { Helmet } from "react-helmet";

export default function Username() {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername );

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // console.log(values)
      setUsername(values.username);
      navigate("/password");
    },
  });

  return (
    <div>
      <Helmet>
        <title>Username | Golden-Box</title>
      </Helmet>
      <section className="mainSection">
        <Toaster position="top-center" reverseOrder={false}></Toaster>

        <div className="container d-flex flex-column justify-content-around mainDiv">
          <div className="content d-flex justify-content-center">
            <h2>Golden-Box</h2>
            <h2>Golden-Box</h2>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-4 col-lg-4">
              <div className="login-wrap">
                <form className="signin-form" onSubmit={formik.handleSubmit}>
                  <div className="form-group my-3">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <div className="form-group">
                          <input
                            {...formik.getFieldProps("username")}
                            type="text"
                            className="form-style"
                            placeholder="Username"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group my-3"></div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary submit px-3"
                    >
                      Let's Go!
                    </button>
                  </div>
                  <div className="d-flex justify-content-center">
                    <h6 className="my-3 bottomText">
                      New to our platform?{" "}
                      <Link to={"/register"}>Register</Link>
                    </h6>
                  </div>
                </form>
                <div className="social d-flex text-center"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
