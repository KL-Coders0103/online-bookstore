import api from "./api";

const login = async (email, password) => {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

const register = async (name, email, password) => {
  return api("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};

const getCurrentUser = async (token) => {
  return api("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export {login, register, getCurrentUser};