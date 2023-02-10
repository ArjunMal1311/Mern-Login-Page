import axios from "axios";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_LOCALSERVER;
const authenciate = async (username) => {
  try {
    return await axios.post("/api/authenciate", { username });
  } catch (error) {
    return { error: "Incorrect credentials!" };
  }
};

const getUsername = async (req, res) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return Promise.reject("Token not found!");
  }

  let decode = jwt_decode(token);
  return decode;
};

const getUser = async ({ username }) => {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    return { error: "Password doesn't Match...!" };
  }
};

const registerUser = async (credentials) => {
  try {
    const {
      data: { message },
      status,
    } = await axios.post(`/api/register`, credentials);

    let { username, email } = credentials;

    if (status === 201) {
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text: message,
      });
    }

    return Promise.resolve(message);
  } catch (error) {
    return Promise.reject({ error });
  }
};

const verifyPassword = async ({ username, password }) => {
  try {
    if (username) {
      const { data } = await axios.post("/api/login", { username, password });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
};

const updateUser = async (userDetails) => {
  try {
    const token = await localStorage.getItem("token");

    const data = await axios.put("/api/updateuser", userDetails, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Updation Failed!" });
  }
};

const generateOTP = async (username) => {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/api/generateOTP", { params: { username } });

    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });

      let OTPText = `Your one time password is ${code}. Don't share this code!`;

      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text: OTPText,
        subject: "Password Recovery OTP",
      });
    }

    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
};

const verifyOTP = async ({ username, code }) => {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });

    return { data, status };
  } catch (error) {
    return Promise.reject({ error });
  }
};

const resetPassword = async ({ username, password }) => {
  try {
    const { data, status } = await axios.put("/api/resetPassword", {
      username,
      password,
    });

    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
};

export {
  getUsername,
  authenciate,
  getUser,
  registerUser,
  verifyPassword,
  updateUser,
  generateOTP,
  verifyOTP,
  resetPassword,
};
