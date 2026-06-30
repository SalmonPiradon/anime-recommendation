import { BlogCard } from "./ui/BlogCard"
import { Field, FieldLabel } from "./ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

import { SearchBar } from "./SearchBar"
import blogPosts from "../data/blogPosts"
import { useState } from "react"




export function ArticleSection() {

  const categories = ["All", "Anime", "Movie", "Series"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // กรองตาม category ที่เลือก กรองต่อด้วยคำค้นหาใน title หรือ description // filter 2 รอบ
  const postsByCategory =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const filteredPosts = postsByCategory.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });


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
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        
        {/* category filter bar of mobile*/}
        <div className="flex w-full flex-col gap-4 lg:hidden">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <Field className="gap-2">
            <FieldLabel className="text-[16px] font-medium text-stone-500">
              Category
            </FieldLabel>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-[50px]! w-full bg-white text-[16px] font-medium text-[#75716B]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="text-[16px] font-medium text-[#75716B]">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16 md:gap-6 md:grid-cols-2">
        {filteredPosts.map((post) => (
          <BlogCard
            key={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
          />
        ))}
      </div>
    </section>
  );
}
