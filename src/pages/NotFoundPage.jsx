import { Link } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { NavBar } from "../components/page-components/NavBar";
import { Footer } from "../components/page-components/Footer";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9F8F6]">
      <NavBar />

      <main className="flex flex-1 flex-col items-center justify-center py-16">
        <CircleAlert
          className="mb-6 size-16 stroke-2 text-[#26231e]"
          aria-hidden="true"
        />
        <h1 className="mb-8 text-3xl font-semibold text-[#26231e] md:text-4xl">
          Page Not Found
        </h1>
        <Link
          to="/"
          className="rounded-full border border-[#26231e] bg-[#26231e] px-8 py-3 text-[16px] font-medium text-white transition-colors hover:bg-[#26231e]/90"
        >
          Go To Homepage
        </Link>
      </main>

      <Footer />
    </div>
  );
}

export default NotFoundPage;
