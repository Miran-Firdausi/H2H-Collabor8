export const getConfig = (additionalHeaders = {}) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `JWT ${localStorage.getItem("access")}`,
    Accept: "application/json",
    ...additionalHeaders,
  },
});
