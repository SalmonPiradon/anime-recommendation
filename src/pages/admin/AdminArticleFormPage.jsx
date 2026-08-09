import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { AdminLayout } from "../../components/page-components/AdminLayout";
import { LoadingState } from "../../components/page-components/LoadingState";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "../../contexts/authentication";
import {
  errorToastClassNames,
  successToastClassNames,
} from "@/lib/toastStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// status_id ตาม backend: 1 = draft, 2 = publish
const STATUS_DRAFT = 1;
const STATUS_PUBLISHED = 2;

// หน้านี้ใช้ทั้ง Create และ Edit
// - /admin/articles/create  → สร้างใหม่
// - /admin/articles/edit/:id → แก้ไขของเดิม
function AdminArticleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { state } = useAuth();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState({});
  const [existingThumbnail, setExistingThumbnail] = useState("");
  const [post, setPost] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    category_id: null,
  });

  const [errors, setErrors] = useState({
    category: "",
    title: "",
    introduction: "",
    content: "",
  });

  const authorName = state.user?.name || "Admin";

  useEffect(() => {
    const loadFormData = async () => {
      try {
        if (isEditMode) {
          setIsLoading(true);
        }

        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/categories`,
        );
        const categoryData = Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : categoriesResponse.data?.categories || [];

        setCategories(categoryData);

        if (isEditMode) {
          const articleResponse = await axios.get(
            `${API_BASE_URL}/posts/admin/${id}`,
          );
          const article = articleResponse.data;

          const categoryId =
            article.category_id != null
              ? String(article.category_id)
              : categoryData.find((cat) => cat.name === article.category)?.id ||
                null;

          setPost({
            title: article.title || "",
            description: article.description || "",
            content: article.content || "",
            category: article.category || "",
            category_id: categoryId,
          });
          setExistingThumbnail(article.image || "");
        }
      } catch (error) {
        console.error("Error loading article form data:", error);
        if (isEditMode) {
          setNotFound(true);
        }
      } finally {
        if (isEditMode) {
          setIsLoading(false);
        }
      }
    };

    loadFormData();
  }, [id, isEditMode]);

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
      toast("Failed to upload file", {
        description: "Please upload a valid image file (JPEG, PNG, GIF, WebP).",
        classNames: errorToastClassNames,
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast("Failed to upload file", {
        description:
          "The file is too large. Please upload an image smaller than 5MB.",
        classNames: errorToastClassNames,
      });
      return;
    }

    setImageFile({ file });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name === "description" ? "introduction" : name]: "",
    }));
  };

  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find((cat) => cat.name === value);
    setPost((prevData) => ({
      ...prevData,
      category: value,
      category_id: selectedCategory?.id || null,
    }));
    setErrors((prev) => ({ ...prev, category: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      category: "",
      title: "",
      introduction: "",
      content: "",
    };

    if (!post.category_id) {
      newErrors.category = "Please select a category";
    }

    if (!post.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!post.description.trim()) {
      newErrors.introduction = "Introduction is required";
    } else if (post.description.trim().length > 120) {
      newErrors.introduction = "Introduction must be at most 120 characters";
    }

    if (!post.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!isEditMode && !imageFile.file) {
      toast("Image is required", {
        description: "Please upload a thumbnail image.",
        classNames: errorToastClassNames,
      });
      setErrors(newErrors);
      return false;
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // statusId: 1 = draft, 2 = publish
  const handleSave = async (postStatusId) => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      if (isEditMode) {
        if (imageFile.file) {
          const formData = new FormData();
          formData.append("title", post.title.trim());
          formData.append("category_id", Number(post.category_id));
          formData.append("description", post.description.trim());
          formData.append("content", post.content.trim());
          formData.append("status_id", Number(postStatusId));
          formData.append("imageFile", imageFile.file);
          await axios.put(`${API_BASE_URL}/posts/${id}`, formData);
        } else {
          await axios.put(`${API_BASE_URL}/posts/${id}`, {
            title: post.title.trim(),
            image: existingThumbnail,
            category_id: Number(post.category_id),
            description: post.description.trim(),
            content: post.content.trim(),
            status_id: Number(postStatusId),
          });
        }

        toast("Saved article", {
          description:
            postStatusId === STATUS_PUBLISHED
              ? "Your article has been successfully published."
              : "Your article has been successfully saved as draft.",
          classNames: successToastClassNames,
        });
      } else {
        const formData = new FormData();
        formData.append("title", post.title.trim());
        formData.append("category_id", Number(post.category_id));
        formData.append("description", post.description.trim());
        formData.append("content", post.content.trim());
        formData.append("status_id", Number(postStatusId));
        formData.append("imageFile", imageFile.file);
        await axios.post(`${API_BASE_URL}/posts`, formData);

        toast("Created article successfully", {
          description:
            postStatusId === STATUS_PUBLISHED
              ? "Your article has been successfully published."
              : "Your article has been successfully saved as draft.",
          classNames: successToastClassNames,
        });
      }

      navigate("/admin/articles");
    } catch (error) {
      toast("Failed to create article", {
        description:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong while trying to save article. Please try again later.",
        classNames: errorToastClassNames,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <AdminLayout pageTitle="Edit article">
        <LoadingState />
      </AdminLayout>
    );
  }

  if (isEditMode && notFound) {
    return (
      <AdminLayout pageTitle="Edit article">
        <p className="text-[16px] text-[#75716B]">Article not found.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle={isEditMode ? "Edit article" : "Create article"}>
      <form
        className="flex max-w-[720px] flex-col gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <Field className="gap-3">
          <FieldLabel className="text-[16px] font-medium text-[#75716B]">
            Thumbnail image
          </FieldLabel>

          <div className="flex items-center gap-4">
            {imageFile.file ? (
              <img
                src={URL.createObjectURL(imageFile.file)}
                alt="Article thumbnail preview"
                className="size-[120px] rounded-xl object-cover"
              />
            ) : existingThumbnail ? (
              <img
                src={existingThumbnail}
                alt="Current article thumbnail"
                className="size-[120px] rounded-xl object-cover"
              />
            ) : (
              <div className="flex size-[120px] items-center justify-center rounded-xl bg-[#EFEEEB] text-[14px] text-[#75716B]">
                No image
              </div>
            )}

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
              className="cursor-pointer rounded-full border border-stone-400 bg-white px-6 py-2 text-[16px] font-medium text-[#26231e]"
            >
              Upload thumbnail image
            </button>
          </div>
        </Field>

        <Field className="gap-2">
          <FieldLabel className="text-[16px] font-medium text-[#75716B]">
            Category
          </FieldLabel>
          <Select value={post.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-[48px]! w-full bg-white text-[16px] text-[#26231e]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-[14px] text-[#EB5164]">{errors.category}</p>
          )}
        </Field>

        <Field className="gap-2">
          <FieldLabel className="text-[16px] font-medium text-[#75716B]">
            Author name
          </FieldLabel>
          <Input
            value={authorName}
            readOnly
            className="h-[48px] bg-[#EFEEEB] text-[16px] text-[#75716B]"
          />
        </Field>

        <Field className="gap-2">
          <FieldLabel className="text-[16px] font-medium text-[#75716B]">
            Title
          </FieldLabel>
          <Input
            name="title"
            value={post.title}
            onChange={handleInputChange}
            placeholder="Article title"
            className="h-[48px] bg-white text-[16px]"
          />
          {errors.title && (
            <p className="text-[14px] text-[#EB5164]">{errors.title}</p>
          )}
        </Field>

        <Field className="gap-2">
          <FieldLabel className="text-[16px] font-medium text-[#75716B]">
            Introduction (max 120 characters)
          </FieldLabel>
          <textarea
            name="description"
            value={post.description}
            onChange={handleInputChange}
            maxLength={120}
            rows={3}
            placeholder="Short introduction"
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-[16px] text-[#26231e] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <p className="text-[14px] text-[#75716B]">
            {post.description.length}/120
          </p>
          {errors.introduction && (
            <p className="text-[14px] text-[#EB5164]">{errors.introduction}</p>
          )}
        </Field>

        <Field className="gap-2">
          <FieldLabel className="text-[16px] font-medium text-[#75716B]">
            Content
          </FieldLabel>
          <textarea
            name="content"
            value={post.content}
            onChange={handleInputChange}
            rows={10}
            placeholder="Write your article content here..."
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-[16px] text-[#26231e] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {errors.content && (
            <p className="text-[14px] text-[#EB5164]">{errors.content}</p>
          )}
        </Field>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave(STATUS_DRAFT)}
            className="cursor-pointer rounded-full border border-stone-500 bg-white px-8 py-3 text-[16px] font-medium text-[#26231e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save as draft
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave(STATUS_PUBLISHED)}
            className="cursor-pointer rounded-full bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save and publish"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AdminArticleFormPage;
