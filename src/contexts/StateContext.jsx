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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

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
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/profile");
      setUser(data);
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
