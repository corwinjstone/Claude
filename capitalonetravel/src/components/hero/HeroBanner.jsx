export default function HeroBanner() {
  return (
    <div className="text-center px-6 pb-10 pt-16 ph:pt-20">
      <h1
        className="text-5xl ph:text-6xl lg:text-7xl text-[#00132b] leading-tight mb-8"
        style={{ fontFamily: "\"Optimist\", sans-serif", fontWeight: 700 }}
      >
        Elevate your travel
      </h1>
      <a
        href="https://travel.capitalone.com/?utm_source=publicsite"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center bg-[#00132b] text-white rounded-md px-8 py-3 text-base transition-colors hover:bg-[#013d5b]"
        style={{ fontFamily: "\"Optimist\", sans-serif", fontWeight: 700 }}
      >
        Book travel
      </a>
    </div>
  );
}
