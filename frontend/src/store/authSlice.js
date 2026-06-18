import { createSlice } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

const loadStoredUser = () => {
  if (!isBrowser) {
    return null;
  }

  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const loadStoredToken = () => {
  if (!isBrowser) {
    return null;
  }

  return localStorage.getItem("token");
};

const initialState = {
  user: loadStoredUser(),
  token: loadStoredToken(),
  isAuthenticated: Boolean(loadStoredToken()),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
