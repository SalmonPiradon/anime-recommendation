import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import {
  Bell,
  ExternalLink,
  FileText,
  FolderOpen,
  LogOut,
  RotateCcw,
  User,
} from "lucide-react";

import { logoutUser } from "../../lib/authStorage";
import { useAuthSession } from "../../hooks/useAuthSession";

// ฟังก์ชันช่วยเปลี่ยนสีลิงก์ sidebar ตามหน้าที่เปิดอยู่
function getSidebarLinkClassName(isActive) {
  return `flex w-full items-center gap-3 px-6 py-5 text-[16px] font-medium ${
    isActive
      ? "bg-[#DAD6D1] text-[#26231e]"
      : "text-[#43403B] hover:bg-[#DAD6D1]/60"
  }`;
}

export function AdminLayout({ pageTitle, children }) {
  const session = useAuthSession();
  const navigate = useNavigate();

  // ถ้ายังไม่ login ให้กลับไปหน้า login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-row bg-[#F9F8F6]">
      {/* Sidebar ด้านซ้าย */}
      <aside className="flex min-h-screen w-[300px] shrink-0 flex-col bg-[#EFEEEB] py-6">
        {/* โลโก้ + คำว่า Admin panel */}
        <header className="flex h-[200px] flex-col justify-center gap-2 px-6">
          <Link to="/" className="text-3xl font-semibold text-[#26231e]">
            Personal Blog
          </Link>
          <p className="text-[20px] font-semibold text-[#F2B68C]">
            Admin panel
          </p>
        </header>

        {/* เมนูหลักของ admin (ใช้ Navlink แทน Link จะดีกว่าเพราะมีการจัดการสถานะการเปิดหน้า isActive ให้อยู่แล้ว)*/}
        <nav className="flex flex-col">
          <NavLink
            to="/admin/articles"
            className={({ isActive }) => getSidebarLinkClassName(isActive)}
          >
            <FileText className="size-5 shrink-0" aria-hidden="true" />
            Article management
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) => getSidebarLinkClassName(isActive)}
          >
            <FolderOpen className="size-5 shrink-0" aria-hidden="true" />
            Category management
          </NavLink>

          <NavLink
            to="/admin/profile"
            className={({ isActive }) => getSidebarLinkClassName(isActive)}
          >
            <User className="size-5 shrink-0" aria-hidden="true" />
            Profile
          </NavLink>

          <NavLink
            to="/admin/notifications"
            className={({ isActive }) => getSidebarLinkClassName(isActive)}
          >
            <Bell className="size-5 shrink-0" aria-hidden="true" />
            Notification
          </NavLink>

          <NavLink
            to="/admin/reset-password"
            className={({ isActive }) => getSidebarLinkClassName(isActive)}
          >
            <RotateCcw className="size-5 shrink-0" aria-hidden="true" />
            Reset password
          </NavLink>
        </nav>

        {/* เมนูด้านล่าง sidebar */}
        <nav className="mt-auto flex flex-col gap-1 pt-6">
          <Link
            to="/"
            className="flex w-full items-center gap-3 px-6 py-3 text-[16px] font-medium text-[#43403B] hover:bg-[#DAD6D1]/60"
          >
            <ExternalLink className="size-5 shrink-0" aria-hidden="true" />
            Blogpost website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 border-t border-stone-300 px-6 py-3 text-[16px] font-medium text-[#43403B] hover:bg-[#DAD6D1]/60"
          >
            <LogOut className="size-5 shrink-0" aria-hidden="true" />
            Log out
          </button>
        </nav>
      </aside>

      {/* เนื้อหาหลักของแต่ละหน้า admin */}
      <main className="flex-1 px-8 py-10">
        {pageTitle && (
          <h1 className="mb-8 text-[32px] font-semibold text-[#26231e]">
            {pageTitle}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
