import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "sonner";

import { AdminLayout } from "../../components/page-components/AdminLayout";
import { Input } from "@/components/ui/input";
import {
  errorToastClassNames,
  successToastClassNames,
} from "@/lib/toastStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ResetPasswordModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[400px] rounded-2xl bg-white px-8 py-10 text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-[#26231e]"
          aria-label="Close dialog"
        >
          <X className="size-6" aria-hidden="true" />
        </button>

        <h2 className="mb-4 text-2xl font-semibold text-[#26231e]">
          Reset password
        </h2>
        <p className="mb-8 text-[16px] text-[#75716B]">
          Do you want to reset your password?
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full cursor-pointer rounded-full bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white"
          >
            Reset password
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer rounded-full border border-stone-500 bg-white px-8 py-3 text-[16px] font-medium text-[#26231e]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminResetPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmReset = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/reset-password`, {
        oldPassword: currentPassword,
        newPassword,
      });

      // เก็บ token ใหม่หลังเปลี่ยนรหัส (token เก่าอาจใช้ต่อไม่ได้)
      if (response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }

      setIsModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast("Password reset", {
        description: "Your password has been successfully updated",
        classNames: successToastClassNames,
      });
    } catch (error) {
      setIsModalOpen(false);

      const message = error.response?.data?.error || "";

      if (
        message.toLowerCase().includes("current") ||
        message.toLowerCase().includes("incorrect") ||
        message.toLowerCase().includes("wrong") ||
        message.toLowerCase().includes("old password")
      ) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect",
        }));
      }

      toast("Could not reset password", {
        description: message || "Please try again later.",
        classNames: errorToastClassNames,
      });
    }
  };

  const getInputClassName = (field) =>
    `h-[48px] bg-white text-[16px] text-[#26231e] placeholder:text-[#75716B] ${
      errors[field] ? "border-red-500" : "border-stone-300"
    }`;

  return (
    <>
      <AdminLayout
        pageTitle="Reset password"
        headerAction={
          <button
            type="submit"
            form="admin-reset-password-form"
            className="cursor-pointer rounded-full bg-[#26231e] px-10 py-3 text-[16px] font-medium text-white hover:bg-[#26231e]/90"
          >
            Reset password
          </button>
        }
      >
        <section className="max-w-[480px]">
          <form
            id="admin-reset-password-form"
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="admin-current-password"
                className="text-[16px] font-medium text-[#75716B]"
              >
                Current password
              </label>
              <Input
                type="password"
                id="admin-current-password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, currentPassword: "" }));
                }}
                placeholder="Current password"
                className={getInputClassName("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-[14px] text-red-500">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="admin-new-password"
                className="text-[16px] font-medium text-[#75716B]"
              >
                New password
              </label>
              <Input
                type="password"
                id="admin-new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, newPassword: "" }));
                }}
                placeholder="New password"
                className={getInputClassName("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-[14px] text-red-500">{errors.newPassword}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="admin-confirm-password"
                className="text-[16px] font-medium text-[#75716B]"
              >
                Confirm new password
              </label>
              <Input
                type="password"
                id="admin-confirm-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                placeholder="Confirm new password"
                className={getInputClassName("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-[14px] text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </form>
        </section>
      </AdminLayout>

      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </>
  );
}

export default AdminResetPasswordPage;
