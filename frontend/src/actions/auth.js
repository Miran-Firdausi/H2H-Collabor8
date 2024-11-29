import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  AUTHENTICATED_FAIL,
  AUTHENTICATED_SUCCESS,
  LOGOUT,
  PASSWORD_RESET_CONFIRM_FAIL,
  PASSWORD_RESET_CONFIRM_SUCCESS,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAIL,
  SIGNUP_FAIL,
  SIGNUP_SUCCESS,
  ACTIVATION_FAIL,
  ACTIVATION_SUCCESS,
  GOOGLE_AUTH_FAIL,
  GOOGLE_AUTH_SUCCESS,
} from "./types";
import axios from "axios";
import { getConfig } from "../utils/httpConfig";

export const load_user = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/users/me/`,
        getConfig()
      );
      dispatch({
        type: USER_LOADED_SUCCESS,
        payload: res.data,
      });
    } catch (err) {
      console.error("Error loading user:", err.response || err.message);
      dispatch({
        type: USER_LOADED_FAIL,
      });
    }
  } else {
    dispatch({
      type: USER_LOADED_FAIL,
    });
  }
};

export const googleAuthenticate = (state, code) => async (dispatch) => {
  console.log("googleAuthenticate called with:", { state, code });

  if (state && code && !localStorage.getItem("access")) {
    console.log(
      "State and code are valid, and no access token in localStorage."
    );

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const details = {
      state: state,
      code: code,
    };
    console.log("Details object:", details);

    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");
    console.log("Form body:", formBody);

    try {
      console.log(
        "Sending POST request to:",
        `${import.meta.env.VITE_API_URL}/auth/o/google-oauth2/?${formBody}`
      );
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/o/google-oauth2/?${formBody}`,
        config
      );
      console.log("Response received:", res.data);

      dispatch({
        type: GOOGLE_AUTH_SUCCESS,
        payload: res.data,
      });
      console.log("GOOGLE_AUTH_SUCCESS dispatched.");

      dispatch(load_user());
      console.log("load_user action dispatched.");
    } catch (err) {
      console.error("Error during authentication:", err);

      dispatch({
        type: GOOGLE_AUTH_FAIL,
      });
      console.log("GOOGLE_AUTH_FAIL dispatched.");
    }
  } else {
    console.log("Invalid state, code, or access token already exists.");
  }
};

export const checkAuthenticated = () => async (dispatch) => {
  if (localStorage.getItem("access")) {
    const body = JSON.stringify({
      token: `${localStorage.getItem("access")}`,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/jwt/verify/`,
      body,
      config
    );
    try {
      if (res.data.code != "token_not_valid") {
        dispatch({
          type: AUTHENTICATED_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: AUTHENTICATED_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: AUTHENTICATED_FAIL,
      });
    }
  } else {
    dispatch({
      type: AUTHENTICATED_FAIL,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  console.log("Login action called with:", { email, password }); // Log the email and password being passed
  const body = JSON.stringify({ email, password });
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/jwt/create/`,
      body,
      config
    );
    console.log("Login successful:", res.data); // Log the response data on successful login
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(load_user());
  } catch (err) {
    console.error("Login failed:", err.response || err.message); // Log any error during login
    dispatch({ type: LOGIN_FAIL });
    throw new Error(err.response?.data?.detail || "Login failed");
  }
};

export const reset_password = (email) => async (dispatch) => {
  const body = JSON.stringify({ email });

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/users/reset_password/`,
      body
    );

    dispatch({
      type: PASSWORD_RESET_SUCCESS,
    });
  } catch (err) {
    const error =
      err.response?.data?.error || "Email not found. Please try again.";
    dispatch({
      type: PASSWORD_RESET_FAIL,
      payload: error,
    });
  }
};

export const reset_password_confirm =
  (uid, token, new_password, re_new_password) => async (dispatch) => {
    const body = JSON.stringify({ uid, token, new_password, re_new_password });

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/users/reset_password_confirm/`,
        body
      );

      dispatch({
        type: PASSWORD_RESET_CONFIRM_SUCCESS,
      });

      return { success: true };
    } catch (err) {
      const errorResponse = err.response?.data || {};
      let errorMessage = "An unknown error occurred. Please try again.";

      if (errorResponse.token) {
        errorMessage = "The reset token is invalid or has expired.";
      } else if (errorResponse.new_password) {
        errorMessage = errorResponse.new_password.join(", ");
      } else if (errorResponse.non_field_errors) {
        errorMessage = errorResponse.non_field_errors.join(", ");
      }

      dispatch({
        type: PASSWORD_RESET_CONFIRM_FAIL,
      });

      return { success: false, message: errorMessage };
    }
  };

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

export const signup =
  (first_name, last_name, email, password, re_password) => async (dispatch) => {
    const body = JSON.stringify({
      first_name,
      last_name,
      email,
      password,
      re_password,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/users/`,
        body,
        config
      );

      dispatch({
        type: SIGNUP_SUCCESS,
        payload: res.data,
      });

      return { success: true };
    } catch (err) {
      const errorResponse = err.response?.data || {};
      let errorMessage = "An unknown error occurred. Please try again.";

      if (errorResponse.email) {
        errorMessage = "This email is already registered.";
      } else if (errorResponse.password) {
        errorMessage = errorResponse.password.join(", ");
      } else if (errorResponse.non_field_errors) {
        errorMessage = errorResponse.non_field_errors.join(", ");
      }

      dispatch({
        type: SIGNUP_FAIL,
      });

      return { success: false, message: errorMessage };
    }
  };

export const verify = (uid, token) => async (dispatch) => {
  const body = JSON.stringify({ uid, token });

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/users/activation/`,
      body
    );
    dispatch({
      type: ACTIVATION_SUCCESS,
    });
  } catch (err) {
    dispatch({ type: ACTIVATION_FAIL });
  }
};
