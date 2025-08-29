import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8069', // From openapi.yaml
  withCredentials: true, // Crucial for sending httpOnly session cookies
});

export default apiClient;