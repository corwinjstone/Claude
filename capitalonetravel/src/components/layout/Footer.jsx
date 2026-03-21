export default function Footer() {
  const columns = [
    {
      title: "Travel",
      links: ["Flights", "Hotels", "Vacation Rentals", "Rental Cars", "Activities", "Packages"],
    },
    {
      title: "Experiences",
      links: ["Premier Collection", "Lifestyle Collection", "Airport Lounges", "Business Travel"],
    },
    {
      title: "Resources",
      links: ["Tips & Planning", "Travel Articles", "Help Center", "Price Match Guarantee", "Price Freeze"],
    },
    {
      title: "Capital One",
      links: ["About Us", "Careers", "Press", "Investor Relations", "Contact Us"],
    },
  ];

  return (
    <footer className="bg-brand-blue text-white">
      <div className="max-w-site mx-auto px-4 py-12">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="white" />
            <path d="M8 16C8 11.582 11.582 8 16 8C20.418 8 24 11.582 24 16" stroke="#D22E1E" strokeWidth="3" strokeLinecap="round"/>
            <path d="M10 19L13 13L16 20L19 14L22 19" stroke="#004879" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-lg">Capital One Travel</span>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App store badges */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a href="#" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-4 py-2.5">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div>
              <div className="text-white/60 text-xs">Download on the</div>
              <div className="text-white text-sm font-semibold">App Store</div>
            </div>
          </a>
          <a href="#" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg px-4 py-2.5">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.18 23.76c.3.17.63.24.97.21l13.1-7.42-2.76-2.76-11.31 9.97zM20.44 10.63L17.47 8.9 14.5 12l3.06 3.08 2.9-1.64c.82-.47.82-1.95-.02-2.81zM2.04.25C1.72.59 1.5 1.06 1.5 1.67v20.66c0 .61.22 1.08.54 1.42l.08.07L13.42 12.1v-.26L2.12.19l-.08.06z"/>
            </svg>
            <div>
              <div className="text-white/60 text-xs">Get it on</div>
              <div className="text-white text-sm font-semibold">Google Play</div>
            </div>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-white/50 text-xs">
            © 2025 Capital One. Capital One Travel is powered by Hopper technology.
          </p>
          <div className="flex gap-4 flex-wrap">
            {["Privacy Policy", "Terms & Conditions", "Accessibility", "Sitemap"].map((item) => (
              <a key={item} href="#" className="text-white/50 hover:text-white/80 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
