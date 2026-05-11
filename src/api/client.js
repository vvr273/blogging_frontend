import axios from "axios";

export const unwrapApiData = (payload) => {
  if (payload && typeof payload === "object" && Object.prototype.hasOwnProperty.call(payload, "success")) {
    if (payload.success === false) {
      const error = new Error(payload.message || "Request failed");
      error.code = payload.code || "REQUEST_ERROR";
      error.requestId = payload.requestId;
      error.details = payload.details || [];
      error.data = payload.data;
      throw error;
    }
    return payload.data;
  }
  return payload;
};

export const mapApiError = (err) => {
  const payload = err?.response?.data;
  if (payload && typeof payload === "object" && Object.prototype.hasOwnProperty.call(payload, "success")) {
    return {
      message: payload.message || "Request failed",
      code: payload.code || "REQUEST_ERROR",
      requestId: payload.requestId || null,
      details: payload.details || [],
    };
  }
  return {
    message: err?.message || "Network request failed",
    code: "NETWORK_ERROR",
    requestId: null,
    details: [],
  };
};

export const toDisplayError = (err) => {
  const parsed = mapApiError(err);
  return parsed.requestId ? `${parsed.message} (Ref: ${parsed.requestId})` : parsed.message;
};

export const createApiClient = (baseURL) => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (response) => ({
      ...response,
      data: unwrapApiData(response.data),
    }),
    (error) => {
      const parsed = mapApiError(error);
      const normalized = new Error(parsed.message);
      normalized.code = parsed.code;
      normalized.requestId = parsed.requestId;
      normalized.details = parsed.details;
      normalized.cause = error;
      return Promise.reject(normalized);
    }
  );

  return instance;
};
