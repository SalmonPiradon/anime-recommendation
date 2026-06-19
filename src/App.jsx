

function App() {
  return (
    <div className="min-h-screen bg-[#efeeeb]">
      <NavBar />
      <HeroSection />
    </div>
  )
}

function NavBar() {
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
  )
}

function HeroSection() {
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
          className="mx-auto h-auto w-full max-w-[500px] rounded-2xl"
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


export default App
