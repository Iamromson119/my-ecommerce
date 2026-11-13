import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("ecom_user");
  if (stored) {
    const user = JSON.parse(stored);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

// The free Render server goes to sleep when nobody's using it. While it wakes up,
// requests fail with a network error or a 502/503/504, so keep trying for about
// a minute before giving up.
export const getWithRetry = async (url, config = {}, tries = 12, waitMs = 5000) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await api.get(url, config);
    } catch (err) {
      const status = err.response?.status;
      const serverIsWaking = !err.response || [502, 503, 504].includes(status);
      const cancelled = err.code === "ERR_CANCELED";
      if (cancelled || !serverIsWaking || attempt >= tries) throw err;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
};

export default api;
