import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useAuthStore } from "../store/store";
import Username from "./Username";
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from "formik";
import { Helmet } from "react-helmet";


const transformText = {
  fontSize: "6em"
}

export default function Recovery() {
  const { username } = useAuthStore((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      if (OTP) {
        return toast.success('OTP has been send to your email!');
      }

      return toast.error('Problem while generating OTP!')
    })
  }, [username])

  const formik = useFormik({
    initialValues: {
      initOTP: "",
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let { status } = await verifyOTP({ username, code: parseInt(values.initOTP) })
        if (status === 201) {
          toast.success('Verify Successfully!')
          return navigate('/reset')
        }
      } catch (error) {
        return toast.error('Wront OTP! Check email again!')
      }
    },
  });

  const resendOTP = () => {
    let sentPromise = generateOTP(username);

    toast.promise(sentPromise,
      {
        loading: 'Sending...',
        success: <b>OTP has been send to your email!</b>,
        error: <b>Could not Send it!</b>,
      }
    );

    // sentPromise.then((OTP) => {
    //   console.log(OTP)
    // });
  }

  return (
    <div>
      <Helmet>
        <title>Recovery | Golden-Box</title>
      </Helmet>
      <section className="mainSection">
        <Toaster position='top-center' reverseOrder={false}></Toaster>

        <div className="container d-flex flex-column justify-content-around mainDiv">
          <div className="content d-flex justify-content-center">
            <h2 style={transformText}>Golden-Box</h2>
            <h2 style={transformText}>Golden-Box</h2>
          </div>

          <p className="bottomText_NotFound bottomText my-5">
            A One Time Password will be sent to your registered email address!
          </p>

          <div className="d-flex justify-content-center">
            <div className="col-lg-4">
              <div className="login-wrap p-0">
                <form className="signin-form" onSubmit={formik.handleSubmit}>
                  <div className="form-group">
                    <div>
                      <div className="section text-center">
                        <div className="form-group">
                          <input
                            {...formik.getFieldProps('initOTP')}
                            type="text"
                            className="form-style my-1"
                            placeholder="One Time Password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group my-2"></div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="form-control btn btn-primary submit px-1 my-1"
                    >
                      Submit
                    </button>
                  </div>
                  <div className="text-center">
                    <button onClick={resendOTP} type="button" className="btn my-2" style={{
                      border: "1px solid rgb(255, 249, 212)",
                    }}>
                      Resend OTP
                    </button>
                  </div>
                  <div className="d-flex justify-content-center">
                    <h6 className="my-3 bottomText">
                      Go back to Login Page?{" "}
                      <Link to={Username}>Login Page</Link>
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
