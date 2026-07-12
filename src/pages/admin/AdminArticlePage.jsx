import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminLayout } from "../../components/page-components/AdminLayout";
import { LoadingState } from "../../components/page-components/LoadingState";
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
  deleteArticle,
  getArticles,
  loadArticles,
} from "@/lib/articleStorage";
import { successToastClassNames } from "@/lib/toastStyles";

// กล่องยืนยันก่อนลบบทความ
function DeleteArticleModal({ isOpen, articleTitle, onClose, onConfirm }) {
  // ถ้ายังไม่เปิด modal ก็ไม่ต้องเรนเดอร์อะไร
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[400px] rounded-2xl bg-white px-8 py-10 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-[#26231e]">
          Delete article
        </h2>
        <p className="mb-8 text-[16px] text-[#75716B]">
          Do you want to delete "{articleTitle}"?
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

// สีของป้ายสถานะ Draft / Published
function getStatusClassName(status) {
  if (status === "Published") {
    return "bg-[#DCFCE7] text-[#166534]"; // เขียว
  }
  return "bg-[#E5E5E5] text-[#525252]"; // เทา (Draft)
}

function AdminArticlePage() {
  // เก็บรายการบทความใน state
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ค่าที่ใช้ค้นหาและกรอง
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // เก็บบทความที่กำลังจะลบ (ใช้เปิด modal)
  const [articleToDelete, setArticleToDelete] = useState(null);

  // ตอนเปิดหน้า → โหลดโพสต์จาก API (ครั้งแรก) หรือจาก localStorage
  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await loadArticles();
        if (isMounted) {
          setArticles(data);
        }
      } catch (error) {
        console.error("Error loading articles:", error);
        // ถ้า API พัง ยังลองอ่านของใน localStorage อยู่
        if (isMounted) {
          setArticles(getArticles());
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  // กรองบทความตาม search + status + category
  const filteredArticles = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchSearch =
        !keyword ||
        article.title.toLowerCase().includes(keyword) ||
        article.category.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "All" || article.status === statusFilter;

      const matchCategory =
        categoryFilter === "All" || article.category === categoryFilter;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [articles, searchQuery, statusFilter, categoryFilter]);

  // กดปุ่มถังขยะ → เปิด modal
  const handleAskDelete = (article) => {
    setArticleToDelete(article);
  };

  // กด Delete ใน modal → ลบจริง + อัปเดตรายการบนหน้าจอ
  const handleConfirmDelete = () => {
    if (!articleToDelete) {
      return;
    }

    deleteArticle(articleToDelete.id);
    setArticles(getArticles());
    setArticleToDelete(null);

    toast("Deleted article", {
      description: "The article has been removed.",
      classNames: successToastClassNames,
    });
  };

  return (
    <AdminLayout pageTitle="Article management">
      <section className="flex flex-col gap-6">
        {/* แถวเครื่องมือ: ค้นหา + กรอง + ปุ่มสร้าง */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[240px] flex-1">
            <Input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[48px] bg-white pr-10 text-[16px] placeholder:text-[#75716B]"
              aria-label="Search articles"
            />
            <Search
              className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-stone-500"
              aria-hidden="true"
            />
          </div>

          {/* กรองตามสถานะ */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-[48px]! w-[160px] bg-white text-[16px] text-[#75716B]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="All">Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
            </SelectContent>
          </Select>

          {/* กรองตามหมวดหมู่ */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-[48px]! w-[180px] bg-white text-[16px] text-[#75716B]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="All">Category</SelectItem>
              {ARTICLE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Link
            to="/admin/articles/create"
            className="ml-auto rounded-full bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white hover:bg-[#26231e]/90"
          >
            Create article
          </Link>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : (
          /* ตารางรายการบทความ */
          <div className="overflow-hidden rounded-2xl bg-white">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[#F9F8F6] text-[14px] font-medium text-[#75716B]">
                <tr>
                  <th className="px-6 py-4 font-medium">Article title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-[16px] text-[#75716B]"
                    >
                      No articles found
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr
                      key={article.id}
                      className="border-t border-stone-200 text-[16px] text-[#26231e]"
                    >
                      <td className="px-6 py-4">{article.title}</td>
                      <td className="px-6 py-4">{article.category}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[14px] font-medium ${getStatusClassName(
                            article.status,
                          )}`}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* ปุ่มแก้ไข → ไปหน้าฟอร์ม edit */}
                          <Link
                            to={`/admin/articles/edit/${article.id}`}
                            className="text-[#75716B] hover:text-[#26231e]"
                            aria-label={`Edit ${article.title}`}
                          >
                            <Pencil className="size-5" aria-hidden="true" />
                          </Link>

                          {/* ปุ่มลบ → เปิด modal */}
                          <button
                            type="button"
                            onClick={() => handleAskDelete(article)}
                            className="cursor-pointer text-[#75716B] hover:text-[#EB5164]"
                            aria-label={`Delete ${article.title}`}
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

      <DeleteArticleModal
        isOpen={Boolean(articleToDelete)}
        articleTitle={articleToDelete?.title || ""}
        onClose={() => setArticleToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}

export default AdminArticlePage;
