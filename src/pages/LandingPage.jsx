import { NavBar } from "../components/page-components/NavBar";
import { HeroSection } from "../components/page-components/HeroSection";
import { Footer } from "../components/page-components/Footer";
import { ArticleSection } from "../components/page-components/ArticleSection";

function LandingPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#F9F8F6]">
        <NavBar />
        <main className="flex-1">
          <HeroSection />
        </main>
        <ArticleSection />
        <Footer />
      </div>
    </>
  )
}

export default LandingPage
