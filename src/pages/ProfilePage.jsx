import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { MemberLayout } from "../components/page-components/MemberLayout";
import { Input } from "@/components/ui/input";
import { useAuth } from "../contexts/authentication";
import {
  errorToastClassNames,
  successToastClassNames,
} from "@/lib/toastStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_PROFILE_PIC = "/image/default-profile-pic.png";

function ProfilePage() {
  const { state, fetchUser } = useAuth();
  const user = state.user;
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [imageFile, setImageFile] = useState(null);         // ไฟล์รูปภาพใหม่ที่จะส่งไปยัง server
  const [isSaving, setIsSaving] = useState(false);          // ใช้สถานะการบันทึกตอนกดปุ่ม Save
  const [errors, setErrors] = useState({ name: "", username: "" });

  // โหลดข้อมูลจาก user ใน AuthContext มาใส่ฟอร์ม
  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name || "");
    setUsername(user.username || "");
    setProfilePicture(user.profilePic || "");
  }, [user]);

  const avatarSrc = profilePicture || DEFAULT_PROFILE_PIC;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast("Invalid file type", {
        description: "Please upload a valid image file (JPEG, PNG, GIF, WebP).",
        classNames: errorToastClassNames,
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast("File too large", {
        description: "Please upload an image smaller than 5MB.",
        classNames: errorToastClassNames,
      });
      return;
    }

    // เก็บไฟล์จริงไว้ส่ง FormData + แสดง preview
    setImageFile(file);
    setProfilePicture(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = { name: "", username: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.username;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !user) {
      return;
    }

    try {
      setIsSaving(true);

      // JSON ส่งไฟล์ binary ไม่ได้ → ใช้ FormData
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("username", username.trim());

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      // Authorization ถูกแนบโดย jwtInterceptor
      await axios.put(`${API_BASE_URL}/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast("Saved profile", {
        description: "Your profile has been successfully updated",
        classNames: successToastClassNames,
      });

      setImageFile(null);
      await fetchUser();
    } catch {
      toast("Failed to update profile", {
        description: "Please try again later.",
        classNames: errorToastClassNames,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInputClassName = (field) =>
    `h-[48px] bg-white text-[16px] text-[#26231e] placeholder:text-[#75716B] ${
      errors[field] ? "border-red-500" : "border-stone-300"
    }`;

  return (
    <MemberLayout pageTitle="Profile">
      <section className="w-full lg:rounded-2xl lg:bg-[#EFEEEB] lg:px-12 lg:py-10">
        <div className="mb-8 flex flex-col items-center gap-4 border-b border-stone-300 pb-8 lg:flex-row lg:items-center lg:gap-6">
          <img
            src={avatarSrc}
            alt={`Profile picture of ${name}`}
            className="size-[120px] rounded-full object-cover"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handleUploadClick}
            className="cursor-pointer rounded-full border border-[#26231e] bg-white px-6 py-3 text-[16px] font-medium text-[#26231e]"
          >
            Upload profile picture
          </button>
        </div>

        <form
          className="flex w-full flex-col gap-6 lg:max-w-[480px]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-[16px] font-medium text-[#75716B]"
            >
              Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={getInputClassName("name")}
            />
            {errors.name && (
              <p className="text-[14px] text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-[16px] font-medium text-[#75716B]"
            >
              Username
            </label>
            <Input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors((prev) => ({ ...prev, username: "" }));
              }}
              className={getInputClassName("username")}
            />
            {errors.username && (
              <p className="text-[14px] text-red-500">{errors.username}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[16px] font-medium text-[#75716B]">
              Email
            </span>
            <p className="text-[16px] text-[#75716B]">{user?.email}</p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-2 w-full cursor-pointer rounded-full bg-[#26231e] py-3 text-[16px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 lg:w-fit lg:px-12"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </form>
      </section>
    </MemberLayout>
  );
}

export default ProfilePage;
