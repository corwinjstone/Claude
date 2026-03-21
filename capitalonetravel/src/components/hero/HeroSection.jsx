const heroImg =
  "https://images.contentstack.io/v3/assets/blt1788ad84f88b68a8/blt8b61ae1412f6b39c/6759cb50197eca75b4cdf5b9/hero-home-4-d.webp";

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(380px, 52vw, 680px)" }}
    >
      {/* Full-bleed background photo */}
      <img
        src={`${heroImg}?width=1800&auto=webp&quality=85`}
        alt="Chapman's Peak coastal road"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
      />

      {/* Arch panel — centered slightly right */}
      <div
        className="absolute flex flex-col items-center justify-center text-center gap-5"
        style={{
          left: "55%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(180px, 20vw, 290px)",
          height: "clamp(240px, 27vw, 380px)",
          background: "#f7f3eb",
          borderRadius: "50% 50% 0 0 / 36% 36% 0 0",
          padding: "12% 10% 14%",
        }}
      >
        <h1
          className="text-[#00132b] leading-snug m-0"
          style={{
            fontFamily: '"Optimist", sans-serif',
            fontWeight: 300,
            fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
          }}
        >
          Elevate<br />your travel
        </h1>
        <a
          href="https://travel.capitalone.com/?utm_source=publicsite"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-[#00132b] text-white rounded-md transition-colors hover:bg-[#013d5b]"
          style={{
            fontFamily: '"Optimist", sans-serif',
            fontWeight: 700,
            fontSize: "clamp(0.7rem, 1vw, 0.85rem)",
            padding: "0.45em 1.2em",
          }}
        >
          Book travel
        </a>
      </div>

      {/* Circular stamp — bottom right */}
      <div
        className="absolute"
        style={{ bottom: "5%", right: "5%" }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          style={{ width: "clamp(52px, 5vw, 72px)", height: "clamp(52px, 5vw, 72px)" }}
        >
          <defs>
            <path
              id="circle-text-path"
              d="M 50,50 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0"
            />
          </defs>
          <text
            fill="white"
            style={{ fontSize: "10.5px", fontFamily: '"Optimist", sans-serif', letterSpacing: "2px" }}
          >
            <textPath href="#circle-text-path" startOffset="10%">
              CAPITAL ONE TRAVEL ·
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}
