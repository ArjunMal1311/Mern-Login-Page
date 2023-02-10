import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import Username from "./Username";
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from "../helper/validate";
import { registerUser } from "../helper/helper";
import { Helmet } from "react-helmet";



export default function Register() {
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values)
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Register Successfully...!</b>,
        error: <b>Could not Register.</b>
      });

      registerPromise.then(function () { navigate('/') });

    }
  })
  return (
    <div>
      <Helmet>
        <title>Register | Golden-Box</title>
      </Helmet>
      <section className="mainSection">
        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="container d-flex flex-column mainDiv">
          <div className="content d-flex justify-content-center">
            <h2>Golden-Box</h2>
            <h2>Golden-Box</h2>
          </div>

          <div className="row d-flex justify-content-center mt-5 pt-5">
            <div className="col-md-4 col-lg-4 mt-4">
              <div >
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-outline mb-3">
                      <input
                        {...formik.getFieldProps('username')}
                        type="text"
                        className="form-style"
                        placeholder="Name"
                      />
                    </div>

                    <div className="row">
                      <div className="mb-3">
                        <div className="form-outline">
                          <input
                            {...formik.getFieldProps('email')}
                            type="email"
                            className="form-style"
                            placeholder="Email"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <input
                        {...formik.getFieldProps('password')}
                        type="password"
                        className="form-style"
                        placeholder="Password"
                      />
                    </div>

                    <div className="row mb-4 pb-2 pb-md-0 mb-md-5">
                      <div className="col-md-6"></div>
                    </div>

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
                        Go back to Login Page?{" "}
                        <Link to={Username}>Login</Link>
                      </h6>
                    </div>
                  </form>
                  <div className="social d-flex text-center"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
