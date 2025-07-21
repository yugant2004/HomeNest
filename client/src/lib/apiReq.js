import axios from "axios";

const apiRequest = axios.create({
    baseURL: "http://localhost:8800/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add request interceptor for debugging
apiRequest.interceptors.request.use(
    (config) => {
        console.log("API Request:", config.url, config.data);
        return config;
    },
    (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
apiRequest.interceptors.response.use(
    (response) => {
        console.log("API Response:", response.status, response.data);
        return response;
    },
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            console.error("Network Error: Unable to connect to the API server. Please check if the server is running.");
            // You can add custom handling for network errors here
        } else {
            console.error("API Response Error:", error.response?.status, error.response?.data || error.message);
        }
        return Promise.reject(error);
    }
);

export default apiRequest;