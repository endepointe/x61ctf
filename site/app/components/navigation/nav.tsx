import { useState, useCallback, useEffect } from "react";
import {
  NavLink,
} from "react-router";

import { 
  AuthenticatedTemplate, UnauthenticatedTemplate, 
  useMsal 
} from "@azure/msal-react"

import { loginRequest } from "../../authConfig.js";

import { 
  IconShieldKeyhole,
  IconWaveProbe,
  IconCipherWheel,
  IconKeycard,
  IconMenu,
  IconClose,
} from "../icons/icons.tsx"

export default function Nav() {
  const { instance } = useMsal();
  const [open, setOpen] = useState(false);
  const handleLinkClick = useCallback(() => setOpen(false), []);

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  }

  const handleLogoutRedirect = () => {
    instance.logoutRedirect().catch((error) => console.log(error));
  }


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const base =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400/70";
  const idle = "text-zinc-300 hover:text-white hover:bg-zinc-800/60";
  const active = "text-emerald-300 bg-zinc-800/60 ring-1 ring-emerald-500/40 hover:text-emerald-200 hover:bg-zinc-800";
  const linkClass = ({ isActive }: { isActive: boolean }) => `${base} ${isActive ? active : idle}`;
  const iconCls = "h-4.5 w-4.5 flex-none";

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-zinc-800/70 bg-zinc-900/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/55"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 md:px-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <IconShieldKeyhole className="h-5 w-5 text-emerald-400" />
          <span className="tracking-wide">x61ctf</span>
          <span className="hidden text-zinc-500 sm:inline">•</span>
          <span className="hidden text-zinc-400 sm:inline">crypto &amp; RE</span>
        </div>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
            <NavLink to="/" end className={linkClass} onClick={handleLinkClick}>
              <IconShieldKeyhole className={iconCls} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/rules" end className={linkClass} onClick={handleLinkClick}>
              <IconWaveProbe className={iconCls} />
              <span>Rules(todo)</span>
            </NavLink>
            <NavLink to="/challenges" className={linkClass} onClick={handleLinkClick}>
              <IconCipherWheel className={iconCls} />
              <span>Challenges</span>
            </NavLink>
            <NavLink to="/account" className={linkClass} onClick={() => console.log("somethingsomething")}>
              <IconKeycard className={iconCls} />
              <span>Account(todo)</span>
            </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-lg p-2 text-zinc-200 hover:bg-zinc-800/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`sm:hidden origin-top overflow-hidden border-t border-zinc-800/70 bg-zinc-900/95 backdrop-blur transition-[max-height,opacity] duration-200 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-6xl px-3 py-2">
          <div className="flex flex-col gap-1 py-1">
            <NavLink to="/" end className={linkClass} onClick={handleLinkClick}>
              <IconShieldKeyhole className={iconCls} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/rules" end className={linkClass} onClick={handleLinkClick}>
              <IconWaveProbe className={iconCls} />
              <span>Rules(todo)</span>
            </NavLink>
            <NavLink to="/challenges" className={linkClass} onClick={handleLinkClick}>
              <IconCipherWheel className={iconCls} />
              <span>Challenges</span>
            </NavLink>

            <NavLink to="/account" className={linkClass} onClick={handleLinkClick}>
              <IconKeycard className={iconCls} />
              <span>Account(todo)</span>
            </NavLink>

          </div>
        </div>
      </div>
    </nav>
  );
}

