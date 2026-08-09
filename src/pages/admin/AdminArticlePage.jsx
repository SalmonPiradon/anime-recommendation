import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
  errorToastClassNames,
  successToastClassNames,
} from "@/lib/toastStyles";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAGE_LIMIT = 10;

// แปลงสถานะจาก API → ข้อความที่โชว์ในตาราง
function mapStatusFromApi(status, statusId) {
  if (statusId === 2 || status === "publish" || status === "Published") {
    return "Published";
  }
  return "Draft";
}

function mapApiPostToArticle(post) {
  return {
    id: String(post.id),
    title: post.title,
    category: post.category || post.category_name || "",
    status: mapStatusFromApi(post.status, post.status_id),
  };
}

// กล่องยืนยันก่อนลบบทความ
function DeleteArticleModal({ isOpen, articleTitle, onClose, onConfirm }) {
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

function getStatusClassName(status) {
  if (status === "Published") {
    return "bg-[#DCFCE7] text-[#166534]";
  }
  return "bg-[#E5E5E5] text-[#525252]";
}

function AdminArticlePage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [articleToDelete, setArticleToDelete] = useState(null);

  // โหลดบทความแบบ pagination (คล้าย ArticleSection)
  const fetchArticles = async (pageNumber, append = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/admin`, {
        params: {
          page: pageNumber,
          limit: PAGE_LIMIT,
        },
      });

      const mapped = (response.data.posts || []).map(mapApiPostToArticle);

      if (append) {
        setArticles((prev) => [...prev, ...mapped]);
      } else {
        setArticles(mapped);
      }

      setHasMore(response.data.currentPage < response.data.totalPages);
    } catch (error) {
      console.error("Error loading articles:", error);
      if (!append) {
        setArticles([]);
      }
      setHasMore(false);
      toast("Failed to load articles", {
        description: "Please try again later.",
        classNames: errorToastClassNames,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // โหลด categories ครั้งเดียวตอนเปิดหน้า
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/categories`,
        );
        const categoryList = Array.isArray(categoriesResponse.data)
          ? categoriesResponse.data
          : categoriesResponse.data?.categories || [];
        setCategories(categoryList.map((category) => category.name));
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // โหลดหน้าแรกตอนเปิดหน้า
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchArticles(1, false);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage, true);
  };

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

  const handleAskDelete = (article) => {
    setArticleToDelete(article);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/posts/${articleToDelete.id}`);
      setArticles((prev) =>
        prev.filter((article) => article.id !== articleToDelete.id),
      );
      setArticleToDelete(null);

      toast("Deleted article", {
        description: "The article has been removed.",
        classNames: successToastClassNames,
      });
    } catch (error) {
      toast("Failed to delete article", {
        description:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Please try again later.",
        classNames: errorToastClassNames,
      });
    }
  };

  return (
    <AdminLayout pageTitle="Article management">
      <section className="flex flex-col gap-6">
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

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-[48px]! w-[180px] bg-white text-[16px] text-[#75716B]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="All">Category</SelectItem>
              {categories.map((category) => (
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

        {isLoading && articles.length === 0 ? (
          <LoadingState />
        ) : (
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
                          <Link
                            to={`/admin/articles/edit/${article.id}`}
                            className="text-[#75716B] hover:text-[#26231e]"
                            aria-label={`Edit ${article.title}`}
                          >
                            <Pencil className="size-5" aria-hidden="true" />
                          </Link>

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

        {isLoading && articles.length > 0 && <LoadingState />}

        {hasMore && !(isLoading && articles.length === 0) && (
          <button
            type="button"
            className="mt-2 mb-4 cursor-pointer self-center text-[16px] font-medium text-[#26231E] underline hover:text-[#26231E]/80 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "View more"}
          </button>
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
