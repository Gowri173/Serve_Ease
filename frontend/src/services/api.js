import axios from 'axios';

const api = axios.create({
  baseURL: 'https://team-delta-uzst.onrender.com/api',
  withCredentials: true, // important for cookies
});

export default api;
