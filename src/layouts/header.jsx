import { useTheme } from "@/hooks/use-theme";
import { ChevronsLeft, Moon, Sun, LogOut, User } from "lucide-react";

import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useStateContext } from "@/contexts/StateContext";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const { logout } = useStateContext(); // ✅ Use global logout

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useClickOutside([dropdownRef], () => setOpen(false));

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
            
            {/* LEFT SIDE */}
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed ? "rotate-180" : ""} />
                </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative flex items-center gap-x-3" ref={dropdownRef}>
                
                {/* THEME TOGGLE */}
                <button
                    className="btn-ghost size-10"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun size={20} className="dark:hidden" />
                    <Moon size={20} className="hidden dark:block" />
                </button>

                {/* PROFILE ICON */}
                <button
                    onClick={() => setOpen(!open)}
                    className="flex size-10 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700"
                >
                    <User size={20} />
                </button>

                {/* DROPDOWN */}
                {open && (
                    <div className="absolute right-0 top-12 w-40 rounded-md bg-white shadow-lg dark:bg-slate-800">
                        <button
                            onClick={logout} // ✅ Calls backend + clears state + redirects
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
