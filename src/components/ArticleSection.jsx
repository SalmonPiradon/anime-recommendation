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



const categories = ["Highlight", "Cat", "Inspiration", "General"];

export function ArticleSection() {
  return (
    <section className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-4 py-10">
      <p className="text-[24px] font-semibold text-[#26231e]">
        Latest articles
      </p>

      <div className="flex w-full flex-col items-center justify-between rounded-2xl bg-[#EFEEEB] px-6 py-4 lg:flex-row">
        <nav className="hidden gap-10 lg:flex">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className="cursor-pointer text-[16px] font-medium px-4 py-3 rounded-md text-[#75716B] hover:bg-[#DAD6D1]"
            >
              {category}
            </button>
          ))}
        </nav>

        <div className="flex w-full flex-col gap-4 lg:hidden">
          <SearchBar />
          <Field className="gap-2">
            <FieldLabel className="text-[16px] font-medium text-stone-500">
              Category
            </FieldLabel>
            <Select defaultValue="Highlight">
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

        <div className="hidden lg:block">
          <SearchBar />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16 md:gap-6 md:grid-cols-2">
        {blogPosts.map((post) => (
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
