import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full shrink-0 lg:w-[360px]">
      <Input
        type="search"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[50px] bg-white pr-10 placeholder:text-[16px] placeholder:font-medium placeholder:text-[#75716B]"
        aria-label="Search articles"
      />
      <Search
        className="absolute right-3 top-1/4 size-[24px] text-stone-500"
        aria-hidden="true"
      />
    </div>
  );
}
