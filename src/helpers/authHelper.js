export const authHeader = () => {
  let sessionObj = getSession();
  if (sessionObj && sessionObj.access_token) {
    return {
      Authorization: "Bearer " + sessionObj.access_token,
      "Content-Security-Policy": "default-src 'self',frame-src 'self'",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
      "X-Frame-Options": "SAMEORIGIN",
      "ngrok-skip-browser-warning": true,
    };
  } else {
    return {
      "Content-Security-Policy": "default-src 'self',frame-src 'self'",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "ngrok-skip-browser-warning": true,
    };
  }
};

export const chatAuth = () => {
  let sessionObj = getSession();
  return {
    "Content-Security-Policy": "default-src 'self',frame-src 'self'",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "ngrok-skip-browser-warning": true,
    "x-auth-token": sessionObj.access_token,
  };
};

export const authHeaderForm = () => {
  let sessionObj = getSession();
  if (sessionObj && sessionObj.access_token) {
    return {
      Authorization: "Bearer " + sessionObj.access_token,
      "Content-Security-Policy": "default-src 'self',frame-src 'self'",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "multipart/form-data",
      "X-Frame-Options": "SAMEORIGIN",
      "ngrok-skip-browser-warning": true,
    };
  } else {
    return {
      "Content-Security-Policy": "default-src 'self',frame-src 'self'",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "multipart/form-data",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "ngrok-skip-browser-warning": true,
    };
  }
};

export const setSession = (sessionObj, rememberMe) => {
  if (sessionObj.authUser && sessionObj.access_token) {
    localStorage.setItem("authUser", JSON.stringify(sessionObj));
  }
};

export const getSession = () => {
  return JSON.parse(localStorage.getItem("authUser"));
};

export const logout = () => {
  localStorage.removeItem("authUser");
  localStorage.clear();
};
