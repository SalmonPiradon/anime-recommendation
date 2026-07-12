import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { MemberLayout } from "../components/page-components/MemberLayout";
import { Input } from "@/components/ui/input";
import { getSessionUser, resetUserPassword } from "@/lib/authStorage";
import {
  errorToastClassNames,
  successToastClassNames,
} from "@/lib/toastStyles";

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
          className="absolute right-4 top-4 cursor-pointer text-[#26231e]"
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

function ResetPasswordPage() {
  const user = getSessionUser();
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

  const handleConfirmReset = () => {
    if (!user) {
      return;
    }

    const result = resetUserPassword(
      user.email,
      currentPassword,
      newPassword,
    );

    setIsModalOpen(false);

    if (!result.success) {
      if (result.error === "current_password") {
        setErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect",
        }));
        toast("Could not reset password", {
          description: "Your current password is incorrect",
          classNames: errorToastClassNames,
        });
        return;
      }

      setErrors((prev) => ({
        ...prev,
        newPassword: "Password must be at least 6 characters",
      }));
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    toast("Password reset", {
      description: "Your password has been successfully updated",
      classNames: successToastClassNames,
    });
  };

  const getInputClassName = (field) =>
    `h-[48px] bg-white text-[16px] text-[#26231e] placeholder:text-[#75716B] ${
      errors[field] ? "border-red-500" : "border-stone-300"
    }`;

  return (
    <>
      <MemberLayout pageTitle="Reset password">
        <section className="w-full lg:rounded-2xl lg:bg-[#EFEEEB] lg:px-12 lg:py-10">
          <form
            className="flex w-full flex-col gap-6 lg:max-w-[480px]"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="current-password"
                className="text-[16px] font-medium text-[#75716B]"
              >
                Current password
              </label>
              <Input
                type="password"
                id="current-password"
                name="currentPassword"
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
                htmlFor="new-password"
                className="text-[16px] font-medium text-[#75716B]"
              >
                New password
              </label>
              <Input
                type="password"
                id="new-password"
                name="newPassword"
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
                htmlFor="confirm-password"
                className="text-[16px] font-medium text-[#75716B]"
              >
                Confirm new password
              </label>
              <Input
                type="password"
                id="confirm-password"
                name="confirmPassword"
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

            <button
              type="submit"
              className="mt-2 w-full cursor-pointer rounded-full bg-[#26231e] py-3 text-[16px] font-medium text-white lg:w-fit lg:px-12"
            >
              Reset password
            </button>
          </form>
        </section>
      </MemberLayout>

      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </>
  );
}

export default ResetPasswordPage;
