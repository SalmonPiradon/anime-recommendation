import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { AdminLayout } from "../../components/page-components/AdminLayout";
import { LoadingState } from "../../components/page-components/LoadingState";
import { Input } from "@/components/ui/input";
import { fetchCategoryById } from "@/lib/categoryStorage";
import {
  errorToastClassNames,
  successToastClassNames,
} from "@/lib/toastStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// หน้าสร้าง / แก้ไข category
// - /admin/categories/create
// - /admin/categories/edit/:id
function AdminCategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadCategory = async () => {
      setIsLoading(true);
      try {
        const category = await fetchCategoryById(id);

        if (!category) {
          setNotFound(true);
          return;
        }

        setName(category.name || "");
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [id, isEditMode]);

  const handleSave = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required");
      return;
    }

    try {
      setIsSaving(true);

      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/categories/${id}`, {
          name: trimmedName,
        });
        toast("Saved category", {
          description: "Your category has been updated.",
          classNames: successToastClassNames,
        });
      } else {
        await axios.post(`${API_BASE_URL}/categories`, {
          name: trimmedName,
        });
        toast("Created category", {
          description: "Your category has been created.",
          classNames: successToastClassNames,
        });
      }

      navigate("/admin/categories");
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "";

      if (
        message.toLowerCase().includes("exist") ||
        message.toLowerCase().includes("duplicate") ||
        message.toLowerCase().includes("unique")
      ) {
        toast("Category already exists", {
          description: "Please use a different category name.",
          classNames: errorToastClassNames,
        });
        return;
      }

      toast("Failed to save category", {
        description: message || "Please try again later.",
        classNames: errorToastClassNames,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <AdminLayout pageTitle="Edit category">
        <LoadingState />
      </AdminLayout>
    );
  }

  if (isEditMode && notFound) {
    return (
      <AdminLayout pageTitle="Edit category">
        <p className="text-[16px] text-[#75716B]">Category not found.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      pageTitle={isEditMode ? "Edit category" : "Create category"}
      headerAction={
        <button
          type="submit"
          form="category-form"
          disabled={isSaving}
          className="cursor-pointer rounded-full bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white hover:bg-[#26231e]/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
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
