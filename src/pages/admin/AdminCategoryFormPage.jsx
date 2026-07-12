import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { AdminLayout } from "../../components/page-components/AdminLayout";
import { Input } from "@/components/ui/input";
import {
  createCategory,
  getCategoryById,
  isCategoryNameTaken,
  updateCategory,
} from "@/lib/categoryStorage";
import {
  errorToastClassNames,
  successToastClassNames,
} from "@/lib/toastStyles";

// หน้าสร้าง / แก้ไข category (หน้าเต็ม ไม่ใช่ modal)
// - /admin/categories/create
// - /admin/categories/edit/:id
function AdminCategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const existingCategory = isEditMode ? getCategoryById(id) : null;

  const [name, setName] = useState(existingCategory?.name || "");
  const [error, setError] = useState("");

  // ถ้าเข้าโหมดแก้แต่หา category ไม่เจอ
  if (isEditMode && !existingCategory) {
    return (
      <AdminLayout pageTitle="Edit category">
        <p className="text-[16px] text-[#75716B]">Category not found.</p>
      </AdminLayout>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required");
      return;
    }

    // ห้ามชื่อซ้ำ
    if (isCategoryNameTaken(trimmedName, id || "")) {
      toast("Category already exists", {
        description: "Please use a different category name.",
        classNames: errorToastClassNames,
      });
      return;
    }

    if (isEditMode) {
      updateCategory(id, trimmedName);
      toast("Saved category", {
        description: "Your category has been updated.",
        classNames: successToastClassNames,
      });
    } else {
      createCategory(trimmedName);
      toast("Created category", {
        description: "Your category has been created.",
        classNames: successToastClassNames,
      });
    }

    // กลับไปหน้ารายการ
    navigate("/admin/categories");
  };

  return (
    <AdminLayout
      pageTitle={isEditMode ? "Edit category" : "Create category"}
      // ปุ่ม Save อยู่มุมขวาบน ตามดีไซน์
      headerAction={
        <button
          type="submit"
          form="category-form"
          className="cursor-pointer rounded-full bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white hover:bg-[#26231e]/90"
        >
          Save
        </button>
      }
    >
      <form id="category-form" className="max-w-[480px]" onSubmit={handleSave}>
        <label className="flex flex-col gap-2">
          <span className="text-[16px] font-medium text-[#75716B]">
            Category name
          </span>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Category name"
            className="h-[48px] bg-white text-[16px]"
            autoFocus
          />
          {error && <p className="text-[14px] text-[#EB5164]">{error}</p>}
        </label>
      </form>
    </AdminLayout>
  );
}

export default AdminCategoryFormPage;
