import { NavLink } from "react-router-dom";
import { RotateCcw, UserIcon } from "lucide-react";

import { NavBar } from "./NavBar";
import { useAuth } from "../../contexts/authentication";

const DEFAULT_PROFILE_PIC = "/image/default-profile-pic.png";

function getMobileNavClassName(isActive) {
  return `flex items-center gap-2 border-b-2 pb-4 text-[16px] font-medium -mb-px ${
    isActive
      ? "border-[#26231e] text-[#26231e] font-semibold"
      : "border-transparent text-[#75716B]"
  }`;
}

function getDesktopNavClassName(isActive) {
  return `flex items-center gap-3 rounded-md px-4 py-3 text-[16px] font-medium ${
    isActive
      ? "bg-[#EFEEEB] text-[#26231e]"
      : "text-[#75716B] hover:bg-[#EFEEEB]/60"
  }`;
}

export function MemberLayout({ pageTitle, children }) {
  const { state } = useAuth();
  const user = state.user;

  const profilePicture =
    user?.profilePic || DEFAULT_PROFILE_PIC;
  const displayName = user?.name || "";

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F8F6]">
      <NavBar />

      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-4 py-6 lg:gap-8 lg:py-10">
        <nav className="flex gap-8 border-b border-stone-300 lg:hidden">
          <NavLink
            to="/profile"
            className={({ isActive }) => getMobileNavClassName(isActive)}
          >
            <UserIcon className="size-5 shrink-0" aria-hidden="true" />
            Profile
          </NavLink>
          <NavLink
            to="/reset-password"
            className={({ isActive }) => getMobileNavClassName(isActive)}
          >
            <RotateCcw className="size-5 shrink-0" aria-hidden="true" />
            Reset password
          </NavLink>
        </nav>

        <header className="flex items-center justify-between gap-4 lg:justify-start">
          <div className="flex items-center gap-3">
            <img
              src={profilePicture}
              alt={displayName}
              className="size-12 rounded-full object-cover"
            />
            <span className="text-[16px] font-medium text-[#26231e]">
              {displayName}
            </span>
          </div>

          <span className="hidden text-stone-300 lg:inline" aria-hidden="true">
            |
          </span>
          <h1 className="text-[20px] font-semibold text-[#26231e] lg:text-[16px]">
            {pageTitle}
          </h1>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          <aside className="hidden lg:block lg:w-[200px] lg:shrink-0">
            <nav className="flex flex-col gap-2">
              <NavLink
                to="/profile"
                className={({ isActive }) => getDesktopNavClassName(isActive)}
              >
                <UserIcon className="size-5 shrink-0" aria-hidden="true" />
                Profile
              </NavLink>
              <NavLink
                to="/reset-password"
                className={({ isActive }) => getDesktopNavClassName(isActive)}
              >
                <RotateCcw className="size-5 shrink-0" aria-hidden="true" />
                Reset password
              </NavLink>
            </nav>
          </aside>

          {children}
        </div>
      </main>
    </div>
  );
}
