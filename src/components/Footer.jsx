import { Briefcase, GitMerge, Mail } from "lucide-react"

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
