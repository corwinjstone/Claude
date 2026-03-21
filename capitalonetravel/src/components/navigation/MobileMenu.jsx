import clsx from "clsx";
import { navLinks } from "../../data/navLinks";
import Button from "../ui/Button";

export default function MobileMenu({ isOpen, onClose }) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-72 bg-brand-blue z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-white font-bold text-lg">Menu</span>
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 px-3 py-3 rounded text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-8">
            <Button variant="ghost" size="md" className="w-full">Sign In</Button>
          </div>
        </div>
      </div>
    </>
  );
}
