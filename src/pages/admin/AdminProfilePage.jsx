import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { AdminLayout } from "../../components/page-components/AdminLayout";
import { Input } from "@/components/ui/input";
import { useAuth } from "../../contexts/authentication";
import {
  errorToastClassNames,
  successToastClassNames,
} from "@/lib/toastStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_PROFILE_PIC = "/image/default-profile-pic.png";

// หน้า Profile ของ admin
// ต่างจาก member ตรงที่มีช่อง Bio (สูงสุด 120 ตัวอักษร)
function AdminProfilePage() {
  const { state, fetchUser } = useAuth();
  const user = state.user;
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    username: "",
    bio: "",
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name || "");
    setUsername(user.username || "");
    setBio(user.bio || "");
    setProfilePicture(user.profilePic || user.profilePicture || "");
  }, [user]);

  const avatarSrc = profilePicture || DEFAULT_PROFILE_PIC;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
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

    setImageFile(file);
    setProfilePicture(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = { name: "", username: "", bio: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (bio.trim().length > 120) {
      newErrors.bio = "Bio must be at most 120 characters";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !user) {
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("username", username.trim());
      formData.append("bio", bio.trim());

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

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
    <AdminLayout
      pageTitle="Profile"
      headerAction={
        <button
          type="submit"
          form="admin-profile-form"
          disabled={isSaving}
          className="cursor-pointer rounded-full bg-[#26231e] px-10 py-3 text-[16px] font-medium text-white hover:bg-[#26231e]/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      }
    >
      <section className="max-w-[560px]">
        <div className="mb-8 flex items-center gap-6">
          <img
            src={avatarSrc}
            alt={`Profile picture of ${name || "admin"}`}
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
            className="cursor-pointer rounded-full border border-stone-400 bg-white px-6 py-3 text-[16px] font-medium text-[#26231e]"
          >
            Upload profile picture
          </button>
        </div>

        <form
          id="admin-profile-form"
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="admin-name"
              className="text-[16px] font-medium text-[#75716B]"
            >
              Name
            </label>
            <Input
              type="text"
              id="admin-name"
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
              htmlFor="admin-username"
              className="text-[16px] font-medium text-[#75716B]"
            >
              Username
            </label>
            <Input
              type="text"
              id="admin-username"
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
            <label
              htmlFor="admin-email"
              className="text-[16px] font-medium text-[#75716B]"
            >
              Email
            </label>
            <Input
              type="email"
              id="admin-email"
              value={user?.email || ""}
              readOnly
              className="h-[48px] border-stone-300 bg-white text-[16px] text-[#75716B]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="admin-bio"
              className="text-[16px] font-medium text-[#75716B]"
            >
              Bio (max 120 letters)
            </label>
            <textarea
              id="admin-bio"
              value={bio}
              maxLength={120}
              rows={5}
              onChange={(e) => {
                setBio(e.target.value);
                setErrors((prev) => ({ ...prev, bio: "" }));
              }}
              placeholder="Tell something about yourself..."
              className={`rounded-md border bg-white px-3 py-2 text-[16px] text-[#26231e] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
                errors.bio ? "border-red-500" : "border-stone-300"
              }`}
            />
            {errors.bio && (
              <p className="text-[14px] text-red-500">{errors.bio}</p>
            )}
          </div>
        </form>
      </section>
    </AdminLayout>
  );
}

export default AdminProfilePage;
