import api from "./api";

const getProfile = async () => {
  const data = await api("/users/profile");

  return data.user;
};

const updateProfile = async (updates) => {
  const data = await api("/users/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });

  return data.user;
};

export {getProfile, updateProfile };