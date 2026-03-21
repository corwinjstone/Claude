import { useState, useRef, useEffect } from "react";
import { navLinks } from "../../data/navLinks";
import MobileMenu from "./MobileMenu";

const LOGO_URL =
  "https://images.contentstack.io/v3/assets/blt1788ad84f88b68a8/bltfb0a779302eedf93/61660dc8a8d4d0113d89bb04/COT_logo.svg";

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-30 bg-white"
        style={{ boxShadow: "0 1px 0 #e9e9e9" }}
      >
        <div className="mx-auto w-full px-6 ph:px-12" style={{ maxWidth: "1440px" }}>
          <div className="flex h-[4.25rem] xlv2:h-[5.25rem] items-center justify-between gap-8">
            {/* Logo */}
            <a href="/" className="flex-shrink-0 py-4">
              <img
                src={LOGO_URL}
                alt="Capital One Travel Logo"
                width={153}
                height={36}
                loading="eager"
              />
            </a>

            {/* Desktop nav */}
            <ul className="hidden xlv2:flex items-stretch h-full gap-[2.9375rem]">
              {navLinks.map((link) => {
                const hasDropdown = link.subGroups && link.subGroups.length > 0;
                const isOpen = activeDropdown === link.label;
                return (
                  <li
                    key={link.label}
                    className="relative flex items-stretch"
                    onMouseEnter={() => hasDropdown && setActiveDropdown(link.label)}
                    onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
                  >
                    {hasDropdown ? (
                      <button
                        className={`flex items-center text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap gap-1 ${
                          isOpen
                            ? "border-[#013d5b] text-[#013d5b]"
                            : "border-transparent text-[#00132b] hover:border-[#013d5b] hover:text-[#013d5b]"
                        }`}
                        onClick={() => setActiveDropdown(isOpen ? null : link.label)}
                      >
                        {link.label}
                        <svg
                          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="flex items-center text-sm border-b-2 border-transparent whitespace-nowrap text-[#00132b] hover:border-[#013d5b] hover:text-[#013d5b] transition-colors"
                      >
                        {link.label}
                      </a>
                    )}

                    {/* Dropdown panel */}
                    {hasDropdown && isOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 bg-white shadow-lg py-9 flex min-w-[480px]">
                        {link.subGroups.map((group) => (
                          <div key={group.heading} className="pr-20 pl-6">
                            <a href={group.headingHref} className="block group">
                              <p
                                className="text-xs font-semibold uppercase tracking-widest text-[#00132b] group-hover:text-[#013d5b]"
                                style={{ fontFamily: "\"Optimist\", sans-serif", fontWeight: 700 }}
                              >
                                {group.heading}
                              </p>
                              <p className="mt-1 text-xs text-[#525252] max-w-[220px] leading-5">
                                {group.description}
                              </p>
                            </a>
                            <ul className="mt-2 space-y-1">
                              {group.links.map((subLink) => (
                                <li key={subLink.label}>
                                  <a
                                    href={subLink.href}
                                    className="text-sm text-[#00132b] hover:text-[#013d5b] transition-colors block py-1"
                                  >
                                    {subLink.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Book travel CTA + hamburger */}
            <div className="flex items-center gap-4">
              <a
                href="https://travel.capitalone.com/?utm_source=publicsite"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xlv2:inline-flex items-center justify-center border-2 border-[#00132b] text-[#00132b] rounded-md px-4 py-1 text-sm transition-colors hover:bg-[#00132b] hover:text-white"
                style={{ fontFamily: "\"Optimist\", sans-serif", fontWeight: 700 }}
              >
                Book travel
              </a>
              <button
                className="xlv2:hidden text-[#00132b] p-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="open menu"
              >
                {mobileOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 7H19C19.6 7 20 6.6 20 6C20 5.4 19.6 5 19 5H5C4.4 5 4 5.4 4 6C4 6.6 4.4 7 5 7Z" />
                    <path d="M19 17H5C4.4 17 4 17.4 4 18C4 18.6 4.4 19 5 19H19C19.6 19 20 18.6 20 18C20 17.4 19.6 17 19 17Z" />
                    <path d="M19 11H5C4.4 11 4 11.4 4 12C4 12.6 4.4 13 5 13H19C19.6 13 20 12.6 20 12C20 11.4 19.6 11 19 11Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
