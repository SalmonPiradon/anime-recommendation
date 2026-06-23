import { NavBar, HeroSection, Footer } from "./components/WebSections"
import { ArticleSection } from "./components/WebSections"

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
