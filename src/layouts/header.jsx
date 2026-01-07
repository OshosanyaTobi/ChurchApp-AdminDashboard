import { useTheme } from "@/hooks/use-theme";
import { Bell, ChevronsLeft, Moon, Search, Sun, LogOut } from "lucide-react";

import profileImg from "@/assets/profile-image.jpg";

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useClickOutside([dropdownRef], () => setOpen(false));

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        navigate("/login", { replace: true });
    };

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed && "rotate-180"} />
                </button>

                <div className="input">
                    <Search size={20} className="text-slate-300" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
                    />
                </div>
            </div>

            <div className="relative flex items-center gap-x-3" ref={dropdownRef}>
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun size={20} className="dark:hidden" />
                    <Moon size={20} className="hidden dark:block" />
                </button>

                <button className="btn-ghost size-10">
                    <Bell size={20} />
                </button>

                {/* Profile Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="size-10 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700"
                >
                    <img
                        src={profileImg}
                        alt="profile"
                        className="size-full object-cover"
                    />
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute right-0 top-12 w-40 rounded-md bg-white shadow-lg dark:bg-slate-800">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
