import toast from "react-hot-toast";
import { authenciate } from "./helper";

// USERNAME COMPONENT
const usernameValidate = async (values) => {
  // console.log(values)
  const errors = usernameVerify({}, values);

  if (values.username) {
    const { status } = await authenciate(values.username);

    if (status !== 200) {
      errors.exist = toast.error("No username found!");
    }
  }

  return errors;
}

const usernameVerify = (error = {}, values) => {
  if (!values.username) {
    error.username = toast.error("No Username Entered");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username");
  }
  return error;
};

// PASSWORD COMPONENT
const passwordValidate = (values) => {
  const errors = passwordVerify({}, values);
  return errors;
}

const passwordVerify = (errors = {}, values) => {
  if (!values.password) {
    errors.password = toast.error("Password Required...!");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Incorrect Credentials!");
  } else if (values.password.length < 4) {
    errors.password = toast.error(
      "Password must be more than 4 characters long"
    );
  }

  return errors;
}
// REGISTER COMPONENT

const registerValidation = (values) => {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
}

const emailVerify = (error = {}, values) => {
  if (!values.email) {
    error.email = toast.error("Email Required...!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email...!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...!");
  }

  return error;
}

// RESET COMPONENT

const resetPasswordValidation = async (values) => {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password not match...!");
  }

  return errors;
}

const profileValidation = (values) => {
  const errors = emailVerify({}, values);
  return errors;
}


export {
  usernameValidate,
  passwordValidate,
  registerValidation,
  resetPasswordValidation,
  profileValidation
}