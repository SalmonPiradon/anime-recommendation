import { NavBar } from "../components/page-components/NavBar";
import { Footer } from "../components/page-components/Footer";
import { LoadingState } from "../components/page-components/LoadingState";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Smile, Copy, X } from "lucide-react";
import { toast } from "sonner"

function CreateAccountModal(props) {
  const { isOpen, onClose } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-[400px] rounded-2xl bg-white px-8 py-10 text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer text-[#26231e]"
          aria-label="Close dialog"
        >
          <X className="size-6" />
        </button>

        <h2 className="mb-8 text-2xl font-semibold text-[#26231e]">
          Create an account to continue
        </h2>

        <button
          type="button"
          className="mb-6 w-full cursor-pointer rounded-full bg-[#26231e] px-8 py-4 text-[16px] font-medium text-white"
        >
          Create account
        </button>

        <p className="text-[16px] text-[#75716B]">
          Already have an account?{" "}
          <button
            type="button"
            className="cursor-pointer font-semibold text-[#26231e] underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

function ArticleDetail() {
  const params = useParams();
  const [articleDetail, setArticleDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // หน้าต่าง pop-up สำหรับการ login

  const isLoggedIn = false; // สมมติว่า user ยังไม่ login

  const fetchArticleDetail = async (postId) => {
    try {
      setIsLoading(true); // แสดงหน้าต่าง loading ขณะกำลังดึงข้อมูลจาก API
      const response = await axios.get(
        `https://blog-post-project-api.vercel.app/posts/${postId}`,
      );
      setArticleDetail(response.data);
    } catch (error) {
      console.error("Error fetching article detail:", error);
    } finally {
      setIsLoading(false); // ซ่อนหน้าต่าง loading หลังจากดึงข้อมูลเสร็จสิ้น
    }
  };

  useEffect(() => {
    fetchArticleDetail(params.id);
  }, [params.id]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // แสดง modal หากยังไม่ login
  const requireLogin = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href); // Copy URL ไป clipboard
    // แสดง toast สำหรับการคัดลอก URL
    toast("Copied!", {
      description: "This article has been copied to your clipboard.",
      classNames: {
        toast: "!bg-[#12B279] !pr-10 !w-[400px]",
        title: "!text-white !font-semibold !text-xl",
        description: "!text-white !text-base",
        closeButton:
          "!left-auto !right-4 !top-4 !transform-none !size-7 [&>svg]:!size-5 !border-none !bg-transparent !text-white hover:!bg-white/20",
      },
    });
  };

  const articleUrl = encodeURIComponent(window.location.href);
  const shareLinks = {
    facebook: `https://www.facebook.com/share.php?u=${articleUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`,
    twitter: `https://www.twitter.com/share?&url=${articleUrl}`,
  };

  return (
    <>
    <div className="flex min-h-screen flex-col bg-[#F9F8F6]">
      <NavBar />

      <main className="flex-1">
        {isLoading ? (
          <LoadingState />
        ) : articleDetail ? (
          <article className="mx-auto w-full max-w-[1400px] py-10">
            <figure className="mb-10 md:px-4">
              <img
                src={articleDetail.image}
                alt={articleDetail.title}
                className="h-[240px] w-full object-cover md:h-[600px] md:rounded-xl"
              />
            </figure>

            <div className="flex flex-col gap-10 px-4 lg:grid lg:grid-cols-[1fr_340px] lg:gap-x-16">
              {/* content section */}
              <div className="order-1 lg:col-start-1 lg:row-start-1">
                <span className="mb-4 inline-block rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
                  {articleDetail.category}
                </span>

                <span className="px-4 text-sm font-medium text-[#75716B]">
                  {formatDate(articleDetail.date)}
                </span>

                <h1 className="mb-12 text-3xl font-bold text-[#26231E] lg:text-4xl">
                  {articleDetail.title}
                </h1>

                <p className="mb-12 text-[16px] leading-relaxed text-[#43403B]">
                  {articleDetail.description}
                </p>

                <div className="markdown mb-16">
                  <ReactMarkdown>{articleDetail.content}</ReactMarkdown>
                </div>
              </div>

              {/* author section */}
              <aside className="order-2 lg:col-start-2 lg:row-start-1 lg:w-[340px] lg:shrink-0">
                <div className="rounded-2xl bg-[#EFEEEB] p-6 lg:sticky lg:top-8">
                  <div className="mb-4 flex items-center gap-3">
                    <img
                      src="/image/author-pic.jpg"
                      alt={articleDetail.author}
                      className="size-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="text-[12px] text-[#75716B]">Author</p>
                      <p className="text-[20px] font-semibold text-[#43403B]">
                        {articleDetail.author}
                      </p>
                    </div>
                  </div>

                  <hr className="mb-4 border-[#DAD6D1]" />

                  <p className="mb-4 text-[16px] leading-relaxed text-stone-700">
                    I am a new developer who is learning to code and build
                    websites. I am currently learning the basics of React and
                    Tailwind CSS. This personal blog is a project to practice my
                    skills and share my hobbies with others.
                  </p>

                  <p className="text-[16px] leading-relaxed text-stone-700">
                    In my free time, I enjoy watching movies and anime. So as a
                    anime and movie lover, I will share my thoughts and reviews
                    about them here. I hope you enjoy my blog and find something
                    interesting to watch..
                  </p>
                </div>
              </aside>

              {/* like and share section */}
              <div className="order-3 lg:col-start-1 lg:row-start-2">
                <div className="mb-12 flex flex-col gap-4 items-center justify-between rounded-xl bg-[#EFEEEB] px-4 py-3 lg:flex-row">
                  <button
                    type="button"
                    onClick={requireLogin}
                    className="flex justify-center cursor-pointer items-center gap-2 rounded-full border border-stone-400 bg-white px-6 py-3 text-[16px] font-medium text-[#26231e] w-full lg:w-auto lg:text-left"
                  >
                    <Smile className="size-5" aria-hidden="true" />
                    {articleDetail.likes}
                  </button>

                  <div className="flex items-center gap-10 lg:gap-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full border border-stone-400 bg-white px-6 py-3 text-[16px] font-medium text-[#26231e] cursor-pointer"
                      onClick={handleCopyLink}
                    >     
                      <Copy className="size-5" aria-hidden="true" />
                      Copy link
                    </button>

                    <div className="flex items-center gap-2">
                      <a href={shareLinks.facebook}>
                        <img
                          src="/icon/Facebook_black.svg"
                          alt="Share on Facebook"
                          className="size-[48px]"
                        />
                      </a>
                      <a href={shareLinks.linkedin}>
                        <img
                          src="/icon/LinkedIN_black.svg"
                          alt="Share on LinkedIn"
                          className="size-[48px]"
                        />
                      </a>
                      <a href={shareLinks.twitter}>
                        <img
                          src="/icon/Twitter_black.svg"
                          alt="Share on X"
                          className="size-[48px]"
                        />
                      </a>
                    </div>
                  </div>
                </div>

                {/* comment section */}
                <section>
                  <h2 className="mb-4 text-2xl font-semibold text-[#26231e]">
                    Comment
                  </h2>

                  <textarea
                    className="mb-4 min-h-[120px] w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-[16px] text-[#26231e] outline-none focus:border-[#26231e]"
                    placeholder="What are your thoughts?"
                    onFocus={requireLogin}
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={requireLogin}
                      className="cursor-pointer rounded-full bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white"
                    >
                      Send
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </article>
        ) : (
          <p className="py-20 text-center text-[16px] font-medium text-[#26231e]">
            Article not found
          </p>
        )}
      </main>

      <Footer />

      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
    </>
  );
}

export default ArticleDetail;
