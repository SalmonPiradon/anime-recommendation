import { NavBar } from "./components/NavBar"
import { HeroSection } from "./components/HeroSection"
import { Footer } from "./components/Footer"
import { ArticleSection } from "./components/ArticleSection"

function App() {
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

export default App
