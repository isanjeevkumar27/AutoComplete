import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth';

export const loginUser = async ({ email, password }) => {
  const res = await axios.post(`${BASE_URL}/login`, { email, password });
  return res.data; // { userId, username }
};

export const signupUser = async ({ username, email, password }) => {
  const res = await axios.post(`${BASE_URL}/signup`, { username, email, password });
  return res.data; // { success, userId, username }
};
