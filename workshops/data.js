// Workshop catalog. Edit this file to change classes, sessions, pricing and instructors.
// Only workshops with status "open" can be booked; everything else shows as "Coming soon".

window.SITE = {
  name: "Colored by Design",
  logo: "assets/logo.png",
  tagline: "Workshops in product design, UX and AI — taught by people who ship.",
  contactEmail: "hello@example.com",
  // Paste a Stripe Payment Link (or any checkout URL) here to collect payment.
  // When empty, signups are confirmed on the page only (no payment taken).
  checkoutUrl: ""
};

window.INSTRUCTORS = {
  "corwin-stone": {
    name: "Corwin Stone",
    title: "VP Product Design",
    photo: "assets/instructor-corwin-stone.jpg",
    brands: ["Apple", "Meta", "Capital One"],
    // Placeholder bio — replace with your own words.
    bio: "Corwin has spent his career turning rough ideas into products people use every day, at companies including Apple, Meta and Capital One. He believes the hardest part of building something is believing you're allowed to start — and that AI has quietly removed most of the other barriers.",
    // Paste a YouTube/Vimeo embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID) to show the intro video.
    introVideoUrl: ""
  }
};

// In-person events shown on the home page hero. Placeholder copy — replace with the real details.
window.EVENTS = [
  {
    id: "misfit-dallas",
    title: "The Making of a Misfit",
    city: "Dallas",
    venue: "Virgin Hotels Dallas",
    dates: "Fri, Nov 6 – Sat, Nov 7",
    image: "assets/misfit-dallas.jpg",
    about: "Two days in Dallas on building things that don't fit the mold. Details and tickets are coming soon.",
    url: ""
  }
];

window.WORKSHOPS = [
  {
    id: "idea-to-innovation",
    status: "open",
    category: "AI",
    eyebrow: ["From", "To"],
    titleLines: ["Ideas", "Innovations"],
    title: "From Idea to Innovation",
    subtitle: "Learn how anybody can turn an idea into an app.",
    metaphor: "leaves",
    heroImage: "assets/idea-leaves.jpg",
    metaphorNote: "Ideas drift past us like falling leaves. This class is about catching one, turning it green, and giving it your focus.",
    price: 59,
    currency: "USD",
    durationMinutes: 90,
    format: "Live on Zoom",
    level: "No experience needed",
    capacity: 20,
    instructor: "corwin-stone",
    audience: "Everyone, everywhere — especially if AI feels intimidating. If you've ever had an idea for an app and thought \"that's not for someone like me,\" this session is for you.",
    outcomes: [
      "Shape a loose idea into a clear, one-sentence app concept",
      "Use Gemini to research, brainstorm and pressure-test the idea",
      "Use Claude to plan screens, write copy and draft the build steps",
      "Use Replit to turn that plan into a working app you can share",
      "Leave with a live link and a next-steps plan — not just notes"
    ],
    tools: [
      { name: "Gemini", role: "Explore & research" },
      { name: "Claude", role: "Plan & write" },
      { name: "Replit", role: "Build & share" }
    ],
    agenda: [
      { minutes: 10, label: "Welcome — the fear is normal, and it's optional" },
      { minutes: 20, label: "Catch an idea: shaping your concept with Gemini" },
      { minutes: 25, label: "Make a plan: screens, words and steps with Claude" },
      { minutes: 25, label: "Build it live in Replit, together" },
      { minutes: 10, label: "Share your link, Q&A, what to do tomorrow" }
    ],
    includes: ["90-minute live session", "Recording for 30 days", "Prompt & checklist workbook", "Small group — 20 seats max"],
    // Upcoming sessions. Times are stored with their UTC offset (US Central) and shown in each visitor's local time.
    // Past sessions are hidden automatically.
    sessions: [
      { id: "2026-10-24", start: "2026-10-24T11:00:00-05:00", seatsLeft: 6 },
      { id: "2026-10-27", start: "2026-10-27T19:00:00-05:00", seatsLeft: 12 },
      { id: "2026-11-07", start: "2026-11-07T11:00:00-06:00", seatsLeft: 14 },
      { id: "2026-11-10", start: "2026-11-10T19:00:00-06:00", seatsLeft: 0 },
      { id: "2026-11-21", start: "2026-11-21T11:00:00-06:00", seatsLeft: 18 },
      { id: "2026-11-24", start: "2026-11-24T19:00:00-06:00", seatsLeft: 20 },
      { id: "2026-12-05", start: "2026-12-05T11:00:00-06:00", seatsLeft: 20 },
      { id: "2026-12-08", start: "2026-12-08T19:00:00-06:00", seatsLeft: 20 }
    ]
  },

  // ---- Placeholders (not yet bookable) ----
  // teaser: shown on the hero cards before registration opens.
  {
    id: "product-design-basics",
    status: "soon",
    category: "Product Design",
    title: "Product Design Basics",
    subtitle: "How good products get decided, sketched and shipped.",
    teaser: "Saturday, October 24",
    about: "A practical first look at how product designers turn a problem into screens people understand: framing the problem, sketching options, and testing them with real people.",
    metaphor: "frames",
    price: 59, durationMinutes: 90, format: "Live on Zoom"
  },
  {
    id: "all-in-on-claude-code",
    status: "soon",
    category: "AI",
    title: "All in on Claude Code",
    subtitle: "Build real software by describing what you want.",
    teaser: "November classes",
    about: "A hands-on series on building with Claude Code: from a blank folder to a working, deployed project, with you steering and Claude doing the typing.",
    metaphor: "sparks",
    price: 79, durationMinutes: 90, format: "Live on Zoom"
  },
  {
    id: "design-systems-that-scale",
    status: "soon",
    category: "Product Design",
    title: "Design Systems That Scale",
    subtitle: "Build one set of blocks that a whole team can stack.",
    metaphor: "blocks",
    price: 79, durationMinutes: 120, format: "Live on Zoom"
  },
  {
    id: "research-on-a-shoestring",
    status: "soon",
    category: "UX",
    title: "UX Research on a Shoestring",
    subtitle: "Find the one insight hiding in a crowd of opinions.",
    metaphor: "dots",
    price: 59, durationMinutes: 90, format: "Live on Zoom"
  },
  {
    id: "prompting-for-product-teams",
    status: "soon",
    category: "AI",
    title: "Prompting for Product Teams",
    subtitle: "Ask better questions, get answers you can ship.",
    metaphor: "bubbles",
    price: 69, durationMinutes: 90, format: "Live on Zoom"
  },
  {
    id: "prototype-in-an-afternoon",
    status: "soon",
    category: "Product Design",
    title: "Prototype in an Afternoon",
    subtitle: "Go from sketch to clickable before the coffee cools.",
    metaphor: "frames",
    price: 79, durationMinutes: 120, format: "Live on Zoom"
  },
  {
    id: "designing-for-trust",
    status: "soon",
    category: "UX",
    title: "Designing for Trust",
    subtitle: "Small details that make people feel safe saying yes.",
    metaphor: "keys",
    price: 59, durationMinutes: 90, format: "Live on Zoom"
  },
  {
    id: "ai-for-designers",
    status: "soon",
    category: "AI",
    title: "AI in the Design Workflow",
    subtitle: "Keep your taste. Hand off the busywork.",
    metaphor: "sparks",
    price: 69, durationMinutes: 90, format: "Live on Zoom"
  }
];
