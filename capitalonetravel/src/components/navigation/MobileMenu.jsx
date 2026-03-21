import { useState } from "react";
import { navLinks } from "../../data/navLinks";

export default function MobileMenu({ isOpen, onClose }) {
  const [premiumOpen, setPremiumOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-screen bg-white z-50 flex flex-col transition-transform duration-300 xlv2:hidden ${
        isOpen ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ paddingTop: "4.25rem" }}
    >
      <ul className="mx-6 flex flex-col flex-1">
        {navLinks.map((link) => {
          const hasDropdown = link.subGroups && link.subGroups.length > 0;
          return (
            <li
              key={link.label}
              className="flex flex-col border-b border-[#e9e9e9]"
            >
              {hasDropdown ? (
                <>
                  <button
                    className="relative flex items-center justify-between w-full py-8 text-base text-[#00132b] hover:text-[#013d5b]"
                    onClick={() => setPremiumOpen(!premiumOpen)}
                  >
                    <span>{link.label}</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`transition-transform ${premiumOpen ? "rotate-0" : "rotate-180"}`}
                    >
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                  </button>
                  {premiumOpen && (
                    <div className="pb-4 pl-2 space-y-4">
                      {link.subGroups.map((group) => (
                        <div key={group.heading}>
                          <a
                            href={group.headingHref}
                            className="block text-xs font-semibold uppercase tracking-widest text-[#00132b] mb-1"
                            style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
                            onClick={onClose}
                          >
                            {group.heading}
                          </a>
                          {group.links.map((subLink) => (
                            <a
                              key={subLink.label}
                              href={subLink.href}
                              className="block py-1 text-sm text-[#00132b] hover:text-[#013d5b]"
                              onClick={onClose}
                            >
                              {subLink.label}
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={link.href}
                  className="flex grow py-8 text-base text-[#00132b] hover:text-[#013d5b]"
                  onClick={onClose}
                >
                  {link.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mx-6 pb-32 pt-8">
        <a
          href="https://travel.capitalone.com/?utm_source=publicsite"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center border-2 border-[#00132b] bg-[#00132b] text-white rounded-md px-6 py-2.5 text-base"
          style={{ fontFamily: "OptimistSemiBold, sans-serif" }}
          onClick={onClose}
        >
          Book travel
        </a>
      </div>
    </div>
  );
}
