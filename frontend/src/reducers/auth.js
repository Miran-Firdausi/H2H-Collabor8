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
} from "../actions/types";

const initialState = {
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
  isAuthenticated: false,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGIN_SUCCESS:
      // Store access and refresh tokens in localStorage
      localStorage.setItem("access", payload.access);
      localStorage.setItem("refresh", payload.refresh);

      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh,
        user: payload.user, // Assuming payload contains user data as well
      };
    case USER_LOADED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
      };
    case GOOGLE_AUTH_SUCCESS:
      // Store Google authentication tokens in localStorage
      localStorage.setItem("access", payload.access);

      return {
        ...state,
        isAuthenticated: true,
        access: payload.access,
        refresh: payload.refresh, // Assuming payload contains refresh token
      };
    case AUTHENTICATED_FAIL:
      return {
        ...state,
        isAuthenticated: false,
      };
    case USER_LOADED_FAIL:
      return {
        ...state,
        user: null,
      };
    case GOOGLE_AUTH_FAIL:
    case SIGNUP_FAIL:
    case LOGIN_FAIL:
      // Clear tokens from localStorage on failure
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      };
    case LOGOUT:
      // Remove tokens from localStorage on logout
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
      };
    case PASSWORD_RESET_SUCCESS:
    case PASSWORD_RESET_FAIL:
    case PASSWORD_RESET_CONFIRM_SUCCESS:
    case ACTIVATION_FAIL:
    case ACTIVATION_SUCCESS:
      return {
        ...state,
      };
    case PASSWORD_RESET_CONFIRM_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
}
