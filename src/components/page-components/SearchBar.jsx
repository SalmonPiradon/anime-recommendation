import { Search } from "lucide-react";
import { Link } from "react-router-dom";

import { Input } from "@/components/ui/input";

export function SearchBar({ value, onChange, results, showResults }) {
  const hasResults = showResults && results.length > 0;

  return (
    <div className="relative w-full shrink-0 lg:w-[360px]">
      <Input
        type="search"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[50px] bg-white pr-10 placeholder:text-[16px] placeholder:font-medium placeholder:text-[#75716B]"
        aria-label="Search articles"
        aria-expanded={hasResults}
        aria-controls="search-results"
      />
      <Search
        className="absolute right-3 top-1/4 size-[24px] text-stone-500"
        aria-hidden="true"
      />

      {hasResults && (
        <ul
          id="search-results"
          className="absolute top-full z-20 mt-2 max-h-[320px] w-full overflow-y-auto rounded-xl border border-stone-200 bg-white shadow-lg"
        >
          {results.map((post) => (
            <li key={post.id}>
              <Link
                to={`/posts/${post.id}`}
                className="block truncate px-4 py-3 text-[16px] text-[#26231e] hover:bg-[#EFEEEB]"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
