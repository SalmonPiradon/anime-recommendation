import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { AdminLayout } from "../../components/page-components/AdminLayout";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ARTICLE_CATEGORIES,
  createArticle,
  getArticleById,
  updateArticle,
} from "@/lib/articleStorage";
import { getSession } from "@/lib/authStorage";
import { successToastClassNames } from "@/lib/toastStyles";

// หน้านี้ใช้ทั้ง Create และ Edit
// - /admin/articles/create  → สร้างใหม่
// - /admin/articles/edit/:id → แก้ไขของเดิม
function AdminArticleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // มี id = โหมดแก้ไข
  const isEditMode = Boolean(id);

  const session = getSession();
  const existingArticle = isEditMode ? getArticleById(id) : null;

  // ref สำหรับ input แบบซ่อน (ใช้เปิดเครื่องเลือกไฟล์)
  const fileInputRef = useRef(null);

  // ค่าในฟอร์ม
  const [thumbnail, setThumbnail] = useState(existingArticle?.thumbnail || "");
  const [category, setCategory] = useState(existingArticle?.category || "");
  const [title, setTitle] = useState(existingArticle?.title || "");
  const [introduction, setIntroduction] = useState(
    existingArticle?.introduction || "",
  );
  const [content, setContent] = useState(existingArticle?.content || "");

  // ข้อความ error ของแต่ละช่อง
  const [errors, setErrors] = useState({
    category: "",
    title: "",
    introduction: "",
    content: "",
  });

  // ชื่อผู้เขียนอ่านอย่างเดียวจาก session
  const authorName = session?.name || existingArticle?.author || "Admin";

  // เปิดหน้าต่างเลือกไฟล์รูป
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // อ่านไฟล์รูปแล้วแปลงเป็น base64 เก็บใน state
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setThumbnail(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ตรวจว่ากรอกครบไหมก่อนบันทึก
  const validateForm = () => {
    const newErrors = {
      category: "",
      title: "",
      introduction: "",
      content: "",
    };

    if (!category) {
      newErrors.category = "Please select a category";
    }

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!introduction.trim()) {
      newErrors.introduction = "Introduction is required";
    } else if (introduction.trim().length > 120) {
      newErrors.introduction = "Introduction must be at most 120 characters";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);

    // ถ้าไม่มี error เลย → ผ่าน
    return !Object.values(newErrors).some(Boolean);
  };

  // บันทึกบทความ (draft หรือ published)
  const handleSave = (status) => {
    if (!validateForm()) {
      return;
    }

    const articleData = {
      title: title.trim(),
      category,
      status, // "Draft" หรือ "Published"
      author: authorName,
      introduction: introduction.trim(),
      content: content.trim(),
      thumbnail,
    };

    if (isEditMode) {
      // โหมดแก้ไข → อัปเดตของเดิม
      updateArticle(id, articleData);
      toast("Saved article", {
        description:
          status === "Published"
            ? "Your article has been published."
            : "Your article has been saved as draft.",
        classNames: successToastClassNames,
      });
    } else {
      // โหมดสร้างใหม่
      createArticle(articleData);
      toast(
        status === "Published"
          ? "Create article and published"
          : "Create article and saved as draft",
        {
          description:
            status === "Published"
              ? "Your article is now live."
              : "You can publish it later.",
          classNames: successToastClassNames,
        },
      );
    }

    // กลับไปหน้ารายการบทความ
    navigate("/admin/articles");
  };

  // ถ้าเข้าโหมด edit แต่หาบทความไม่เจอ
  if (isEditMode && !existingArticle) {
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
        {/* อัปโหลดรูป thumbnail */}
        <Field className="gap-3">
          <FieldLabel className="text-[16px] font-medium text-[#75716B]">
            Thumbnail image
          </FieldLabel>

          <div className="flex items-center gap-4">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Article thumbnail preview"
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

        {/* เลือกหมวดหมู่ */}
        <Field className="gap-2">
          <FieldLabel className="text-[16px] font-medium text-[#75716B]">
            Category
          </FieldLabel>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setErrors((prev) => ({ ...prev, category: "" }));
            }}
          >
            <SelectTrigger className="h-[48px]! w-full bg-white text-[16px] text-[#26231e]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {ARTICLE_CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-[14px] text-[#EB5164]">{errors.category}</p>
          )}
        </Field>

        {/* ชื่อผู้เขียน (แก้ไม่ได้) */}
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

        {/* หัวข้อบทความ */}
        <Field className="gap-2">
          <FieldLabel className="text-[16px] font-medium text-[#75716B]">
            Title
          </FieldLabel>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            placeholder="Article title"
            className="h-[48px] bg-white text-[16px]"
          />
          {errors.title && (
            <p className="text-[14px] text-[#EB5164]">{errors.title}</p>
          )}
        </Field>

        {/* คำโปรยสั้นๆ สูงสุด 120 ตัวอักษร */}
        <Field className="gap-2">
          <FieldLabel className="text-[16px] font-medium text-[#75716B]">
            Introduction (max 120 characters)
          </FieldLabel>
          <textarea
            value={introduction}
            onChange={(e) => {
              setIntroduction(e.target.value);
              setErrors((prev) => ({ ...prev, introduction: "" }));
            }}
            maxLength={120}
            rows={3}
            placeholder="Short introduction"
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-[16px] text-[#26231e] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <p className="text-[14px] text-[#75716B]">
            {introduction.length}/120
          </p>
          {errors.introduction && (
            <p className="text-[14px] text-[#EB5164]">{errors.introduction}</p>
          )}
        </Field>

        {/* เนื้อหาบทความ */}
        <Field className="gap-2">
          <FieldLabel className="text-[16px] font-medium text-[#75716B]">
            Content
          </FieldLabel>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setErrors((prev) => ({ ...prev, content: "" }));
            }}
            rows={10}
            placeholder="Write your article content here..."
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-[16px] text-[#26231e] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          {errors.content && (
            <p className="text-[14px] text-[#EB5164]">{errors.content}</p>
          )}
        </Field>

        {/* ปุ่มบันทึก */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSave("Draft")}
            className="cursor-pointer rounded-full border border-stone-500 bg-white px-8 py-3 text-[16px] font-medium text-[#26231e]"
          >
            Save as draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("Published")}
            className="cursor-pointer rounded-full bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white"
          >
            {isEditMode ? "Save and publish" : "Save and publish"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AdminArticleFormPage;
