export function NavBar() {
  return (
    <header className="border-b border-stone-300">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4">
        <a href="/" className="text-2xl font-semibold text-[#26231e]">
          Personal Blog
        </a>

        {/* Hamburger menu for mobile */}
        <button
          type="button"
          className="cursor-pointer lg:hidden"
          aria-label="Open menu"
        >
          <img
            src="/icon/hamburger-icon.svg"
            alt="hamburger-icon"
            className="h-6 w-6"
            aria-hidden="true"
          />
        </button>

        <nav className="hidden gap-3 lg:flex">
          <button
            type="button"
            className="cursor-pointer rounded-full border border-stone-500 bg-white px-8 py-3 text-[16px] font-medium text-[#26231e]"
          >
            Log in
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full border border-[#26231e] bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white"
          >
            Sign up
          </button>
        </nav>
      </div>
    </header>
  );
}
