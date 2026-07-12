import { useRef, useState } from "react";
import { toast } from "sonner";

import { AdminLayout } from "../../components/page-components/AdminLayout";
import { Input } from "@/components/ui/input";
import {
  getSessionUser,
  isUsernameTaken,
  updateUserProfile,
} from "@/lib/authStorage";
import { successToastClassNames } from "@/lib/toastStyles";

// หน้า Profile ของ admin
// ต่างจาก member ตรงที่มีช่อง Bio (สูงสุด 120 ตัวอักษร)
function AdminProfilePage() {
  const user = getSessionUser();
  const fileInputRef = useRef(null);

  // ค่าเริ่มต้นดึงจาก user ที่ login อยู่
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || "",
  );
  const [errors, setErrors] = useState({
    name: "",
    username: "",
    bio: "",
  });

  const avatarSrc = profilePicture || "/image/default-profile-pic.png";

  // เปิดหน้าต่างเลือกไฟล์รูป
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // อ่านไฟล์แล้วแปลงเป็น base64 เก็บใน state
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePicture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ตรวจฟอร์มก่อนบันทึก
  const validateForm = () => {
    const newErrors = { name: "", username: "", bio: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (user && isUsernameTaken(username, user.email)) {
      newErrors.username = "Username is already taken";
    }

    if (bio.trim().length > 120) {
      newErrors.bio = "Bio must be at most 120 characters";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm() || !user) {
      return;
    }

    updateUserProfile(user.email, {
      name: name.trim(),
      username: username.trim(),
      profilePicture,
      bio: bio.trim(),
    });

    toast("Saved profile", {
      description: "Your profile has been successfully updated",
      classNames: successToastClassNames,
    });
  };

  const getInputClassName = (field) =>
    `h-[48px] bg-white text-[16px] text-[#26231e] placeholder:text-[#75716B] ${
      errors[field] ? "border-red-500" : "border-stone-300"
    }`;

  return (
    <AdminLayout
      pageTitle="Profile"
      // ปุ่ม Save อยู่มุมขวาบน ตามดีไซน์
      headerAction={
        <button
          type="submit"
          form="admin-profile-form"
          className="cursor-pointer rounded-full bg-[#26231e] px-10 py-3 text-[16px] font-medium text-white hover:bg-[#26231e]/90"
        >
          Save
        </button>
      }
    >
      <section className="max-w-[560px]">
        {/* รูปโปรไฟล์ + ปุ่มอัปโหลด */}
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
          {/* Name */}
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

          {/* Username */}
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

          {/* Email แก้ไม่ได้ แต่แสดงเป็นช่อง input ตามดีไซน์ */}
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

          {/* Bio สูงสุด 120 ตัวอักษร */}
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
