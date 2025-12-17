import axios from "axios";

const API_URL = "http://localhost:5000/api/profile";

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
