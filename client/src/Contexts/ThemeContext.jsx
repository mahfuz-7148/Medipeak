import React, { useEffect, useState } from "react";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import clsx from "clsx";

const ThemeToggleButton = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setAnimate(true);
        setTheme(prev => (prev === "light" ? "dark" : "light"));
        setTimeout(() => setAnimate(false), 500);
    };

    return (
        <button
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className={clsx(
                "group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border hover:shadow-md",
                "bg-emerald-100/60 hover:bg-emerald-200 border-emerald-200"
            )}
        >
            {/* Optional glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/10 to-cyan-300/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Icon with animation and larger size */}
            <div
                className={clsx(
                    "relative z-10 transition-all duration-500 transform",
                    {
                        "rotate-[360deg] scale-125 opacity-0": animate,
                        "opacity-100 scale-100": !animate
                    }
                )}
            >
                {theme === "light" ? (
                    <MoonOutlined className="text-2xl text-slate-700 group-hover:text-slate-900 transition-colors duration-300" />
                ) : (
                    <SunOutlined className="text-2xl text-amber-300 group-hover:text-amber-400 transition-colors duration-300" />
                )}
            </div>
        </button>
    );
};

export default ThemeToggleButton;
