import { useRef, useState } from "react";
import { toast } from "sonner";

import { MemberLayout } from "../components/page-components/MemberLayout";
import { Input } from "@/components/ui/input";
import {
  getSessionUser,
  isUsernameTaken,
  updateUserProfile,
} from "@/lib/authStorage";
import { successToastClassNames } from "@/lib/toastStyles";

function ProfilePage() {
  const user = getSessionUser();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || "",
  );
  const [errors, setErrors] = useState({ name: "", username: "" });

  const avatarSrc = profilePicture || "/image/default-profile-pic.png";

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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

  const validateForm = () => {
    const newErrors = { name: "", username: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (isUsernameTaken(username, user.email)) {
      newErrors.username = "Username is already taken";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.username;
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

        <form className="flex w-full flex-col gap-6 lg:max-w-[480px]" onSubmit={handleSubmit}>
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
            className="mt-2 w-full cursor-pointer rounded-full bg-[#26231e] py-3 text-[16px] font-medium text-white lg:w-fit lg:px-12"
          >
            Save
          </button>
        </form>
      </section>
    </MemberLayout>
  );
}

export default ProfilePage;
