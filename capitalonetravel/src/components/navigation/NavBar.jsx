import { Menu, X } from "lucide-react";
import { navLinks } from "../../data/navLinks";
import { useMobileMenu } from "../../hooks/useMobileMenu";
import Button from "../ui/Button";
import MobileMenu from "./MobileMenu";

export default function NavBar() {
  const { isOpen, toggle, close } = useMobileMenu();

  return (
    <nav className="bg-brand-blue">
      <div className="max-w-site mx-auto px-4">
        {/* Main nav row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="white" />
              <path d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16" stroke="#D22E1E" strokeWidth="3" strokeLinecap="round"/>
              <path d="M10 19L13 13L16 20L19 14L22 19" stroke="#004879" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white font-bold text-lg tracking-tight">Capital One Travel</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign In</Button>
            <button
              onClick={toggle}
              className="lg:hidden text-white p-1.5 rounded hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isOpen} onClose={close} />
    </nav>
  );
}
