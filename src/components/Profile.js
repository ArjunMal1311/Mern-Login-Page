import { useFormik } from "formik";
import React from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { profileValidation } from "../helper/validate";
import "../index.css";
import { useFetch } from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper'
import { Helmet } from "react-helmet";


const transformText = {
  fontSize: "5em",
};

export default function Profile() {
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      username: apiData?.username || '',
      email: apiData?.email || '',
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values)
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });

    }
  })

  const userLogout = () => {
    localStorage.removeItem('token');
    navigate('/')
  }

  if (isLoading) {
    return <div className="bgr"><div className="custom-loader"></div></div>
  }
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>


  return (
    <div>
      <Helmet>
        <title>Profile | Golden-Box</title>
      </Helmet>
      <section className="mainSection">
        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="container d-flex flex-column mainDiv">
          <div className="content d-flex justify-content-center mt-1">
            <h2 style={transformText}>Golden-Box</h2>
            <h2 style={transformText}>Golden-Box</h2>
          </div>

          <div className="row d-flex justify-content-center mt-5 pt-5">
            <h2 className="bottomText bottomText_NotFound mt-2">
              {" "}
              "We're delighted to offer the most hospitable welcome we can."
            </h2>
            <div className="col-md-4 col-lg-4">
              <div>
                <div className="card-body p-4 p-md-5 my-3">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-outline mb-2 my-3">
                      <input
                        {...formik.getFieldProps('username')}
                        type="text"
                        className="form-style"
                        placeholder="Name"
                      />
                    </div>

                    <div className="row">
                      <div className="mb-2">
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

                    <div className="row mb-4 pb-2 pb-md-0 md-5 my-3">
                      <div className="col-md-6"></div>
                    </div>

                    <div className="form-group">
                      <button
                        type="submit"
                        className="form-control btn btn-primary submit px-3 my-2"
                      >
                        Update Information
                      </button>
                    </div>

                  </form>
                  <div className="text-center">
                    <button onClick={userLogout} type="button" className="btn" style={{
                      border: "1px solid rgb(255, 249, 212)",
                    }}>
                      Logout
                    </button>
                  </div>
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
