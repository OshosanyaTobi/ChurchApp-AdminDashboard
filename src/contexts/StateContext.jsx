import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import API from "../api/axios";

const StateContext = createContext();

const initialClickState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const StateProvider = ({ children }) => {
  // ================= UI STATE =================
  const [screenSize, setScreenSize] = useState(undefined);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialClickState);
  const [themeSettings, setThemeSettings] = useState(false);

  // ================= AUTH STATE =================
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ================= UI METHODS =================
  const handleClick = (clicked) =>
    setIsClicked({ ...initialClickState, [clicked]: true });

  // ================= AUTH METHODS =================
  const register = async (payload) => {
    await API.post("/register", payload);
  };

  const login = async (credentials) => {
    const { data } = await API.post("/login", credentials);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  };

  // ✅ IMPROVED LOGOUT (Backend + Redirect)
  const logout = async () => {
    try {
      await API.post("/logout");
    } catch (error) {
      // ignore backend logout failure
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    // Force redirect to login
    window.location.href = "/login";
  };

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/profile");

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch {
      logout();
    }
  };

  // Auto-load user on refresh
  useEffect(() => {
    if (token && !user) fetchProfile();
  }, [token]);

  // ================= NOTIFICATIONS =================
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New order received",
      message: "Order #3921 has been placed",
    },
    {
      id: 2,
      title: "New user signup",
      message: "A new user just registered",
    },
  ]);

  const value = useMemo(
    () => ({
      // UI
      screenSize,
      setScreenSize,
      activeMenu,
      setActiveMenu,
      isClicked,
      handleClick,
      themeSettings,
      setThemeSettings,
      notifications,
      setNotifications,

      // AUTH
      user,
      token,
      login,
      register,
      logout,
      fetchProfile,
    }),
    [screenSize, activeMenu, isClicked, themeSettings, user, token]
  );

  return (
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
