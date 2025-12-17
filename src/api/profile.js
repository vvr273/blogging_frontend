import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_profile;

export const fetchProfile = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (data, token) => {
  const res = await axios.put(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
