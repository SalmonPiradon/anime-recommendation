import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminLayout } from "../../components/page-components/AdminLayout";
import { LoadingState } from "../../components/page-components/LoadingState";
import { Input } from "@/components/ui/input";
import { loadCategories } from "@/lib/categoryStorage";
import {
  errorToastClassNames,
  successToastClassNames,
} from "@/lib/toastStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function DeleteCategoryModal({ isOpen, categoryName, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[400px] rounded-2xl bg-white px-8 py-10 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-[#26231e]">
          Delete category
        </h2>
        <p className="mb-8 text-[16px] text-[#75716B]">
          Do you want to delete "{categoryName}"?
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full cursor-pointer rounded-full bg-[#EB5164] px-8 py-3 text-[16px] font-medium text-white"
          >
            Delete
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

function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await loadCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
        toast("Failed to load categories", {
          description:
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Please try again later.",
          classNames: errorToastClassNames,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(keyword),
    );
  }, [categories, searchQuery]);

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/categories/${categoryToDelete.id}`,
      );
      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryToDelete.id),
      );
      setCategoryToDelete(null);

      toast("Deleted category", {
        description: "The category has been removed.",
        classNames: successToastClassNames,
      });
    } catch (error) {
      toast("Failed to delete category", {
        description:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Please try again later.",
        classNames: errorToastClassNames,
      });
    }
  };

  return (
    <AdminLayout
      pageTitle="Category management"
      headerAction={
        <Link
          to="/admin/categories/create"
          className="rounded-full bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white hover:bg-[#26231e]/90"
        >
          + Create category
        </Link>
      }
    >
      <section className="flex flex-col gap-6">
        <div className="relative max-w-[360px]">
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[48px] bg-white pr-10 text-[16px] placeholder:text-[#75716B]"
            aria-label="Search categories"
          />
          <Search
            className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-stone-500"
            aria-hidden="true"
          />
        </div>

        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[#F9F8F6] text-[14px] font-medium text-[#75716B]">
                <tr>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="w-[120px] px-6 py-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-10 text-center text-[16px] text-[#75716B]"
                    >
                      No categories found
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-t border-stone-200 text-[16px] text-[#26231e]"
                    >
                      <td className="px-6 py-4">{category.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/admin/categories/edit/${category.id}`}
                            className="text-[#75716B] hover:text-[#26231e]"
                            aria-label={`Edit ${category.name}`}
                          >
                            <Pencil className="size-5" aria-hidden="true" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(category)}
                            className="cursor-pointer text-[#75716B] hover:text-[#EB5164]"
                            aria-label={`Delete ${category.name}`}
                          >
                            <Trash2 className="size-5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <DeleteCategoryModal
        isOpen={Boolean(categoryToDelete)}
        categoryName={categoryToDelete?.name || ""}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}

export default AdminCategoryPage;
