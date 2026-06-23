import { useState } from "react"
import { Briefcase, GitMerge, Mail, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { FieldLabel, Field } from "./ui/field"

export function NavBar() {
  return (
    <header className="border-b border-stone-300">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4">
        <a href="/" className="text-2xl font-semibold text-[#26231e]">
          Personal Blog
        </a>

        {/* Hamburger menu for mobile */}
        <button
          type="button"
          className="cursor-pointer lg:hidden"
          aria-label="Open menu"
        >
          <img
            src="/icon/hamburger-icon.svg"
            alt="hamburger-icon"
            className="h-6 w-6"
            aria-hidden="true"
          />
        </button>

        <nav className="hidden gap-3 lg:flex">
          <button
            type="button"
            className="cursor-pointer rounded-full border border-stone-500 bg-white px-8 py-3 text-[16px] font-medium text-[#26231e]"
          >
            Log in
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-full border border-[#26231e] bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white"
          >
            Sign up
          </button>
        </nav>
      </div>
    </header>
  );
}

export function HeroSection() {
  return (
    <section className="px-4 pt-10 pb-16">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-10 xl:flex-row xl:items-center xl:justify-center xl:gap-16">
        <div className="flex w-full max-w-[400px] flex-col gap-4 text-center xl:flex-1 xl:gap-6 xl:text-left">
          <h1 className="text-[2rem] font-semibold text-[#26231e] xl:text-right xl:text-[2.5rem]">
            Stories, Reviews,
            <br />
            Recommendations
          </h1>
          <p className="text-base leading-relaxed text-stone-700 xl:text-right">
            Honest reviews and recommendations for anime and movies — find your
            next favorite watch.
          </p>
        </div>

        <img
          src="/image/author-pic.jpg"
          alt="Portrait of Piradon L., author of the blog"
          className=" h-auto w-full max-w-[400px] rounded-2xl"
        />

        <article className="flex flex-col gap-3 text-left w-[347px]">
          <p className="text-sm text-stone-500">-Author</p>
          <h2 className="text-2xl font-semibold text-[#26231e]">Piradon L.</h2>
          <p className="text-[16px] leading-relaxed text-stone-700">
            I am a new developer who is learning to code and build websites. I
            am currently learning the basics of React and Tailwind CSS. This
            personal blog is a project to practice my skills and share my
            hobbies with others.
          </p>
          <p className="text-[16px] leading-relaxed text-stone-700">
            In my free time, I enjoy watching movies and anime. So as a anime
            and movie lover, I will share my thoughts and reviews about them
            here. I hope you enjoy my blog and find something interesting to
            watch..
          </p>
        </article>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#EFEEEB] px-4 py-10">
      <div className="flex justify-between items-center mx-auto max-w-[1400px] flex-col lg:flex-row gap-4 lg:gap-0">
        <div className="flex gap-6">
          <p className="text-[16px] font-medium text-[brown/500]">Get in touch</p>
          <div className="flex gap-3">
            <a href="https://www.linkedin.com/in/piradon-leungamornnara-97bb32254/" aria-label="LinkedIn">
              <Briefcase />
            </a>
            <a href="https://github.com/SalmonPiradon" aria-label="GitHub">
              <GitMerge />
            </a>
            <a href="mailto:piradon.leungamornnara@gmail.com" aria-label="Email">
              <Mail />
            </a>
          </div>
        </div>

        <div className="text-[16px] font-medium text-[#26231e] underline">
          <a href="/" className="hover:text-[#26231e]/80 transition-colors duration-300">
            Home page
          </a>
        </div>
      </div>
    </footer>
  );
}

export function SearchBar() {
  return (
    <div className="relative w-full shrink-0 lg:w-[360px]">
      <Input
        type="search"
        placeholder="Search"
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

export function ArticleSection() {
  const [category, setCategory] = useState("highlight")

  return (
    <section className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-10">
      <p className="text-[24px] font-semibold text-[#26231e]">
        Latest articles
      </p>

      <div className="flex items-center justify-between w-full bg-[#EFEEEB] rounded-2xl py-4 px-6 flex-col lg:flex-row">
        <nav className="gap-10 hidden lg:flex">
          <button
            type="button"
            className="text-[16px] font-medium text-[#75716B] cursor-pointer"
          >
            Highlight
          </button>
          <button
            type="button"
            className="text-[16px] font-medium text-[#75716B] cursor-pointer"
          >
            Anime
          </button>
          <button
            type="button"
            className="text-[16px] font-medium text-[#75716B] cursor-pointer"
          >
            Movie
          </button>
          <button
            type="button"
            className="text-[16px] font-medium text-[#75716B] cursor-pointer"
          >
            My top 5
          </button>
        </nav>

        <div className="flex w-full flex-col gap-4 lg:hidden">
          <SearchBar />
          <Field className="gap-2">
            <FieldLabel className="text-[16px] font-medium text-stone-500">
              Category
            </FieldLabel>
            <Select defaultValue="highlight">
              <SelectTrigger className="h-[50px]! w-full bg-white text-[16px] font-medium text-[#75716B]">
                <SelectValue placeholder="Highlight" />
              </SelectTrigger>
              <SelectContent className="text-[16px] font-medium text-[#75716B]">
                <SelectItem value="highlight">Highlight</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="my-top-5">My top 5</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="hidden lg:block">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}