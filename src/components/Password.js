import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";

import "../index.css";
import { useAuthStore } from "../store/store";
import { passwordValidate } from "../helper/validate";
import { verifyPassword } from "../helper/helper";
import { useFetch } from "../hooks/fetch.hook";
import { Helmet } from "react-helmet";

export default function Password() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, serverError }] = useFetch(`/user/${username}`)

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = verifyPassword({ username, password: values.password })
      // console.log(loginPromise)
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success: <b>Login Successfully...!</b>,
        error: <b>Password Not Match!</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile')
      })
    }
  })

  if (isLoading) {
    return <div className="bgr"><div className="custom-loader"></div></div>
  }

  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div>
      <Helmet>
        <title>Password | Golden-Box</title>
      </Helmet>
      <section className="mainSection">
        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="container d-flex flex-column justify-content-around mainDiv">
          <div className="content d-flex justify-content-center">
            <h2>Golden-Box</h2>
            <h2>Golden-Box</h2>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-4 col-lg-4">
              <div className="login-wrap p-0">
                <form onSubmit={formik.handleSubmit} className="signin-form">
                  <div className="form-group my-3">
                    <div className="center-wrap">
                      <div className="section text-center">
                        <div className="form-group">
                          <input
                            {...formik.getFieldProps("password")}
                            type="password"
                            className="form-style"
                            placeholder="Password"
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
                      Submit
                    </button>
                  </div>
                  <div className="d-flex justify-content-center">
                    <h6 className="my-3 bottomText">
                      Forgot password? <Link to={"/Recovery"}>Reset Here</Link>
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
