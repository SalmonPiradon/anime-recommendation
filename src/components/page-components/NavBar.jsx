import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";

import { getProfilePicture, logoutUser } from "../../lib/authStorage";
import { useAuthSession } from "../../hooks/useAuthSession";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const menuItemClassName =
  "flex items-center gap-3 px-4 py-3 text-[16px] font-medium text-[#43403B]";

export function NavBar() {
  const session = useAuthSession();
  const isLoggedIn = Boolean(session);
  const profilePicture = getProfilePicture(session);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="relative z-50 border-b border-stone-300 bg-[#F9F8F6]">
      <div className="mx-auto max-w-[1400px] px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-semibold text-[#26231e]">
            Personal Blog
          </a>

          {/* navbar for logged in user (desktop) */}
          {isLoggedIn ? (
            <nav className="hidden items-center gap-3 lg:flex">
              <button
                type="button"
                className="flex size-[48px] cursor-pointer items-center justify-center rounded-full border bg-white"
                aria-label="Notifications"
              >
                <img
                  src="/icon/Bell-icon.svg"
                  alt=""
                  className="size-[24px]"
                  aria-hidden="true"
                />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-2 rounded-full border-0 bg-transparent p-0"
                  >
                    <img
                      src={profilePicture}
                      alt={session.name}
                      className="size-12 rounded-full object-cover"
                    />
                    <span className="text-[16px] font-medium text-[#26231e]">
                      {session.name}
                    </span>
                    <ChevronDown
                      className="size-4 text-stone-500"
                      aria-hidden="true"
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="mt-2">
                  <DropdownMenuItem
                    asChild
                    className="flex cursor-pointer items-center gap-2 text-[16px] font-medium text-[#43403B]"
                  >
                    <Link to="/profile">
                      <UserIcon />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="flex cursor-pointer items-center gap-2 text-[16px] font-medium text-[#43403B]"
                  >
                    <Link to="/reset-password">
                      <SettingsIcon />
                      Reset password
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="flex cursor-pointer items-center gap-2 text-[16px] font-medium text-[#43403B]"
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      <LogOutIcon />
                      Log out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          ) : (
            <>
              {/* navbar for logged out user (desktop) */}
              <nav className="hidden gap-3 lg:flex">
                <Link to="/login">
                  <button
                    type="button"
                    className="cursor-pointer rounded-full border border-stone-500 bg-white px-8 py-3 text-[16px] font-medium text-[#26231e]"
                  >
                    Log in
                  </button>
                </Link>

                <Link to="/signup">
                  <button
                    type="button"
                    className="cursor-pointer rounded-full border border-[#26231e] bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white"
                  >
                    Sign up
                  </button>
                </Link>
              </nav>
            </>
          )}
          {/* hamburger icon */}
          <button
            type="button"
            className="cursor-pointer lg:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <img
              src="/icon/hamburger-icon.svg"
              alt=""
              className="h-6 w-6"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* mobile menu (for logged in user) */}
      {isMenuOpen && (
        <nav className="absolute w-full border-t border-stone-300 bg-[#F9F8F6] shadow-md lg:hidden">
          <div className="mx-auto max-w-[1400px] px-4 pb-6 pt-4">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={profilePicture}
                      alt={session.name}
                      className="size-12 rounded-full object-cover"
                    />
                    <span className="text-[16px] font-medium text-[#26231e]">
                      {session.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="flex size-[48px] cursor-pointer items-center justify-center rounded-full border bg-white"
                    aria-label="Notifications"
                  >
                    <img
                      src="/icon/Bell-icon.svg"
                      alt=""
                      className="size-[24px]"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <Link
                  to="/profile"
                  className={menuItemClassName}
                >
                  <UserIcon className="size-5 shrink-0" aria-hidden="true" />
                  Profile
                </Link>

                <Link
                  to="/reset-password"
                  className={menuItemClassName}
                >
                  <SettingsIcon className="size-5 shrink-0" aria-hidden="true" />
                  Reset password
                </Link>

                <hr className="my-2 border-stone-300" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${menuItemClassName} w-full cursor-pointer`}
                >
                  <LogOutIcon className="size-5 shrink-0" aria-hidden="true" />
                  Log out
                </button>
              </div>
            ) : (
              <>
              {/* mobile menu (for logged out user) */}
              <div className="flex flex-col gap-4">
                <Link to="/login">
                  <button
                    type="button"
                    className="w-full cursor-pointer rounded-full border border-stone-500 bg-white py-3 text-[16px] font-medium text-[#26231e]"
                  >
                    Log in
                  </button>
                </Link>

                <Link to="/signup">
                  <button
                    type="button"
                    className="w-full cursor-pointer rounded-full border border-[#26231e] bg-[#26231e] py-3 text-[16px] font-medium text-white"
                  >
                    Sign up
                  </button>
                </Link>
              </div>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
