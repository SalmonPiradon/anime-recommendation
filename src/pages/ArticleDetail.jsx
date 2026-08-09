import { NavBar } from "../components/page-components/NavBar";
import { Footer } from "../components/page-components/Footer";
import { LoadingState } from "../components/page-components/LoadingState";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Smile, Copy, X } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../contexts/authentication";
import {
  errorToastClassNames,
  successToastClassNames,
} from "@/lib/toastStyles";

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

        <Link
          to="/signup"
          className="mb-6 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#26231e] px-8 py-4 text-[16px] font-medium text-white"
        >
          Create account
        </Link>

        <p className="text-[16px] text-[#75716B]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="cursor-pointer font-semibold text-[#26231e] underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function ArticleDetail() {
  const params = useParams();
  const { state } = useAuth();
  const user = state.user;

  const [articleDetail, setArticleDetail] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);    // เอา comment ที่ post ไปมาแสดงผล .map()
  const [commentText, setCommentText] = useState("");   // เก็บ comment ที่พิมพ์ใน textarea
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchArticleDetail = async (postId) => {
    try {
      setIsLoading(true);
      // ใช้ Promise.all เพื่อดึงข้อมูลพร้อมกัน เพื่อลดการรอข้อมูลทีละครั้ง
      const [postResponse, likesResponse, commentsResponse] = await Promise.all(
        [
          axios.get(`${API_BASE_URL}/posts/${postId}`),
          axios.get(`${API_BASE_URL}/posts/${postId}/likes`),
          axios.get(`${API_BASE_URL}/posts/${postId}/comments`),
        ],
      );
      setArticleDetail(postResponse.data);
      setLikes(likesResponse.data.like_count ?? 0);
      setComments(commentsResponse.data || []);
    } catch (error) {
      console.error("Error fetching article detail:", error);
      setArticleDetail(null);
    } finally {
      setIsLoading(false);
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

  const formatCommentDate = (date) =>
    new Date(date)
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(", ", " at ");

  const requireLogin = () => {
    if (!user) {
      setIsModalOpen(true);
      return false;
    }
    return true;
  };

  const handleLikeClick = async () => {
    if (!requireLogin()) {
      return;
    }

    setIsLiking(true);
    try {
      try {
        await axios.post(`${API_BASE_URL}/posts/${params.id}/likes`);
      } catch (error) {
        // ถ้า like ซ้ำแล้ว → unlike แทน
        if (error.response?.status === 500 || error.response?.status === 400) {
          await axios.delete(`${API_BASE_URL}/posts/${params.id}/likes`);
        } else {
          throw error;
        }
      }

      const likesResponse = await axios.get(
        `${API_BASE_URL}/posts/${params.id}/likes`,
      );
      setLikes(likesResponse.data.like_count ?? 0);
    } catch (error) {
      console.error("Error handling like/unlike:", error);
      toast("Failed to update like", {
        description: "Please try again later.",
        classNames: errorToastClassNames,
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleSendComment = async () => {
    if (!requireLogin()) {
      return;
    }

    if (!commentText.trim()) {
      toast("Comment is empty", {
        description: "Please type something before sending.",
        classNames: errorToastClassNames,
      });
      return;
    }

    setIsSendingComment(true);
    try {
      await axios.post(`${API_BASE_URL}/posts/${params.id}/comments`, {
        comment: commentText.trim(),
      });
      const commentsResponse = await axios.get(
        `${API_BASE_URL}/posts/${params.id}/comments`,
      );
      setComments(commentsResponse.data);
      setCommentText("");
      toast("Comment Posted!", {
        description: "Your comment has been successfully added to this post.",
        classNames: successToastClassNames,
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast("Failed to post comment", {
        description:
          error.response?.data?.message || "Please try again later.",
        classNames: errorToastClassNames,
      });
    } finally {
      setIsSendingComment(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
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

                <aside className="order-2 lg:col-start-2 lg:row-start-1 lg:w-[340px] lg:shrink-0">
                  <div className="rounded-2xl bg-[#EFEEEB] p-6 lg:sticky lg:top-8">
                    <div className="mb-4 flex items-center gap-3">
                      <img
                        src="/image/author-pic.jpg"
                        alt={articleDetail.author || "Author"}
                        className="size-12 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <p className="text-[12px] text-[#75716B]">Author</p>
                        <p className="text-[20px] font-semibold text-[#43403B]">
                          {articleDetail.author || "Admin"}
                        </p>
                      </div>
                    </div>

                    <hr className="mb-4 border-[#DAD6D1]" />

                    <p className="mb-4 text-[16px] leading-relaxed text-stone-700">
                      I am a new developer who is learning to code and build
                      websites. I am currently learning the basics of React and
                      Tailwind CSS. This personal blog is a project to practice
                      my skills and share my hobbies with others.
                    </p>

                    <p className="text-[16px] leading-relaxed text-stone-700">
                      In my free time, I enjoy watching movies and anime. So as
                      a anime and movie lover, I will share my thoughts and
                      reviews about them here. I hope you enjoy my blog and find
                      something interesting to watch..
                    </p>
                  </div>
                </aside>

                <div className="order-3 lg:col-start-1 lg:row-start-2">
                  <div className="mb-12 flex flex-col items-center justify-between gap-4 rounded-xl bg-[#EFEEEB] px-4 py-3 lg:flex-row">
                    <button
                      type="button"
                      onClick={handleLikeClick}
                      disabled={isLiking}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-stone-400 bg-white px-6 py-3 text-[16px] font-medium text-[#26231e] disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto lg:text-left"
                    >
                      <Smile className="size-5" aria-hidden="true" />
                      {likes}
                    </button>

                    <div className="flex items-center gap-10 lg:gap-3">
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-2 rounded-full border border-stone-400 bg-white px-6 py-3 text-[16px] font-medium text-[#26231e]"
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

                  <section>
                    <h2 className="mb-4 text-2xl font-semibold text-[#26231e]">
                      Comment
                    </h2>

                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="mb-4 min-h-[120px] w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-[16px] text-[#26231e] outline-none focus:border-[#26231e]"
                      placeholder="What are your thoughts?"
                      onFocus={() => {
                        if (!user) {
                          setIsModalOpen(true);
                        }
                      }}
                    />

                    <div className="mb-10 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSendComment}
                        className="cursor-pointer rounded-full bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSendingComment ? "Sending..." : "Send"}
                      </button>
                    </div>

                    <div className="space-y-6">
                      {comments.map((comment, index) => (
                        <div key={comment.id} className="flex flex-col gap-2">
                          <div className="flex space-x-4">
                            <img
                              src={
                                comment.profile_pic || "/image/author-pic.jpg"
                              }
                              alt={comment.name}
                              className="size-12 rounded-full object-cover"
                            />
                            <div className="flex flex-col items-start">
                              <h4 className="font-semibold text-[#26231e]">
                                {comment.name}
                              </h4>
                              <span className="text-sm text-[#75716B]">
                                {formatCommentDate(comment.created_at)}
                              </span>
                            </div>
                          </div>
                          <p className="text-[#43403B]">{comment.comment_text}</p>
                          {index < comments.length - 1 && (
                            <hr className="my-2 border-[#DAD6D1]" />
                          )}
                        </div>
                      ))}
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
