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
