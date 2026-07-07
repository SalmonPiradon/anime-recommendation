import { BlogCard } from "../ui/BlogCard";
import { Field, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { SearchBar } from "./SearchBar";
import { LoadingState } from "./LoadingState";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function ArticleSection() {
  const categories = ["Highlight", "Cat", "Inspiration", "General"];
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // category รับข้อมูลมาจาก getPostsData(selectedCategory)
  // filter category จาก select ตรงนี้
  const fetchPosts = async (category, pageNumber, append = false) => {
    setIsLoading(true); // เริ่ม loading

    try {
      const params = {
        page: pageNumber,
        limit: 6,
      };

      // Highlight แสดงทุก category
      if (category !== "Highlight") {
        params.category = category;
      }

      const response = await axios.get(
        "https://blog-post-project-api.vercel.app/posts",
        { params },
      );

      // แยกการแสดงผลของหน้าแรก กับ หน้าถัดไปเพราะเจอปัญหาการแสดงผลของหน้าแรก
      if (append) {
        setBlogPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
      } else {
        setBlogPosts(response.data.posts);
      }

      // ตรวจสอบว่ามีข้อมูลต่อไหม ถ้าไม่มีข้อมูลต่อไปจะไม่แสดงปุ่ม View more
      setHasMore(response.data.currentPage < response.data.totalPages);

    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false); // สิ้นสุด loading
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchPosts(selectedCategory, 1, false);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    setPage(page + 1);
    fetchPosts(selectedCategory, page + 1, true);
  };

  // ค้นหาบทความจาก API เมื่อพิมพ์ใน search bar
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(
          "https://blog-post-project-api.vercel.app/posts",
          { params: { keyword: searchQuery, limit: 20 } },
        );
        setSearchResults(response.data.posts);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Error searching posts:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // function แปลง date จาก "2024-09-11T00:00:00.000Z" เป็น "11 September 2024"
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleSearchFocus = () => {
    if (searchQuery.trim() && searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleCloseSearchResults = () => {
    setShowSearchResults(false);
  };

  const searchBarProps = {
    value: searchQuery,
    onChange: setSearchQuery,
    results: searchResults,
    showResults: showSearchResults,
    onFocus: handleSearchFocus,
    onCloseResults: handleCloseSearchResults,
  };

  return (
    <section className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-4 py-10">
      <p className="text-[24px] font-semibold text-[#26231e]">
        Latest articles
      </p>

      {/* category filter bar of PC */}
      <div className="flex w-full flex-col items-center justify-between rounded-2xl bg-[#EFEEEB] px-6 py-4 lg:flex-row">
        <nav className="hidden gap-10 lg:flex">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`cursor-pointer rounded-md px-4 py-3 text-[16px] font-medium text-[#75716B] ${
                selectedCategory === category
                  ? "bg-[#DAD6D1]"
                  : "hover:bg-[white]"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>
        <div className="hidden lg:block">
          <SearchBar {...searchBarProps} />
        </div>

        {/* category filter bar of mobile*/}
        <div className="flex w-full flex-col gap-4 lg:hidden">
          <SearchBar {...searchBarProps} />

          <Field className="gap-2">
            <FieldLabel className="text-[16px] font-medium text-stone-500">
              Category
            </FieldLabel>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-[50px]! w-full bg-white text-[16px] font-medium text-[#75716B]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="text-[16px] font-medium text-[#75716B]">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      {isLoading && blogPosts.length === 0 ? (
        <LoadingState />
      ) : (
        <div className="grid grid-cols-1 gap-16 md:gap-6 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Link key={post.id} to={`/posts/${post.id}`}>
              <BlogCard
                image={post.image}
                category={post.category}
                title={post.title}
                description={post.description}
                author={post.author}
                date={formatDate(post.date)}
              />
            </Link>
          ))}
        </div>
      )}

      {isLoading && blogPosts.length > 0 && <LoadingState />}

      {hasMore && !(isLoading && blogPosts.length === 0) && (
        <button
          type="button"
          className="mt-10 mb-30 cursor-pointer self-center text-[16px] font-medium text-[#26231E] underline hover:text-[#26231E]/80"
          onClick={handleLoadMore}
        >
          {isLoading ? "Loading..." : "View more"}
        </button>
      )}
    </section>
  );
}
