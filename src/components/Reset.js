import React from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { resetPasswordValidation } from '../helper/validate'
import { resetPassword } from '../helper/helper'
import { useAuthStore } from '../store/store';
import { useNavigate, Navigate } from 'react-router-dom';
import { useFetch } from '../hooks/fetch.hook'
import { Helmet } from 'react-helmet';

const transformText = {
  fontSize: "7em",
};

export default function Reset() {
  const { username } = useAuthStore((state) => state.auth)
  const navigate = useNavigate()
  const [{ isLoading, status, serverError }] = useFetch('createResetSession')

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: ''
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let resetPromise = resetPassword({ username, password: values.password })

      toast.promise(resetPromise, {
        loading: 'Updating...',
        success: <b>Reset Successfully...!</b>,
        error: <b>Could not Reset!</b>
      });

      resetPromise.then(function () { navigate('/password') })
    }
  })

  if (isLoading) {
    return <div className="bgr"><div className="custom-loader"></div></div>
  }
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
  if (status && status !== 201) return <Navigate to={'/password'} replace={true}></Navigate>



  return (
    <div>
      <Helmet>
        <title>Reset | Golden-Box</title>
      </Helmet>
      <section className="mainSection">
        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="container d-flex flex-column justify-content-around mainDiv">
          <div className="content d-flex justify-content-center my-3">
            <h2 style={transformText}>Golden-Box</h2>
            <h2 style={transformText}>Golden-Box</h2>
          </div>

          <p className="bottomText_NotFound bottomText my-5 text-center">Tip: The password should be at least 4 characters long. To make it stronger, use upper and lower case letters, numbers and special symbols.</p>

          <div className="d-flex justify-content-center">
            <div className="col-lg-4">
              <div className="login-wrap p-0">
                <form className="signin-form" onSubmit={formik.handleSubmit}>
                  <div className="form-group">
                    <div>
                      <div className="section text-center">
                        <div className="form-group">
                          <input
                            {...formik.getFieldProps('password')}
                            type="password"
                            className="form-style my-2"
                            placeholder="New password here!"
                          />
                          <input
                            {...formik.getFieldProps('confirm_pwd')}
                            type="password"
                            className="form-style"
                            placeholder="Again! 🤗"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group my-2"></div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary submit px-3"
                    >
                      Submit
                    </button>
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
