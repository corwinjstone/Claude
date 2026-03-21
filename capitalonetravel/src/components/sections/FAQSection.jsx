import { useState } from "react";

const faqs = [
  {
    question: "Who can use Capital One Travel?",
    answer:
      "Capital One Travel is available to customers with a US-issued, eligible Capital One or Discover by Capital One credit card. Book travel reservations for flights, hotels and car rentals through Capital One Travel and pay via reward redemptions, travel credits and/or your eligible Capital One or Discover by Capital One credit card, including: Venture X, Venture, VentureOne; Quicksilver, QuicksilverOne, Quicksilver for Good Credit, Quicksilver Student, Quicksilver Secured; Savor, SavorOne, Savor Student, Savor for Good Credit; Journey; Discover it Miles, Discover it Cash Back, Discover it Chrome, Discover it Chrome Gas & Restaurant.",
  },
  {
    question: "How do I book a trip through Capital One Travel?",
    answer:
      "You'll need to have an online account to make reservations with Capital One Travel. Once you do, you can make new bookings online or by contacting Capital One Travel by phone—please note, bookings made over the phone may incur a booking fee. If you don't have an online account, set up online access on Capital One's website, enter your personal information, select a username and password, and you're all set.",
  },
  {
    question: "Can I use my Capital One or Discover by Capital One rewards to book a trip through Capital One Travel?",
    answer:
      "Yes! You can use your rewards to book flights, hotels, vacation rentals and rental cars through Capital One Travel. The number of rewards needed for travel redemption varies and is based on the cost of the travel purchase. Rewards redeemed for Capital One Travel bookings do not earn rewards.",
  },
  {
    question: "How do I know I'm getting a fair price on Capital One Travel?",
    answer:
      "Capital One Travel offers multiple features to help you get the best price. With our price match guarantee, if you find a better price for a flight, hotel or rental car on another site within 24 hours of booking, you'll get a travel credit for the difference. We also proactively adjust our hotel rates to match or beat other travel sites.",
  },
  {
    question: "If I book a trip through Capital One Travel, will I still earn rewards for my airline or hotel loyalty programs?",
    answer:
      "Yes and no. When you book through Capital One Travel, you have the option to link your airline loyalty account to your flight reservation(s), so you can continue to earn rewards. However, we're unable to link to hotel loyalty programs through Capital One Travel.",
  },
  {
    question: "Do you have as many flights, hotels and rental cars as other travel sites?",
    answer:
      "Capital One Travel offers trips from over 200 airlines, 2 million hotel properties, and nearly 200 rental car companies. There'll be thousands of options to choose from for your next trip.",
  },
  {
    question: "What is price drop protection?",
    answer:
      "We're so confident in our price prediction tool for flights that if you 'book now' when we recommend, we automatically offer free price drop protection. With price drop protection, we keep monitoring the price of the flight after you buy it, and if the price drops, we'll give you a refund up to the maximum amount specified when you booked.",
  },
];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e9e9e9]">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span
          className="text-base text-[#00132b] leading-snug"
          style={{ fontFamily: "\"Optimist\", sans-serif", fontWeight: 700 }}
        >
          {question}
        </span>
        <svg
          className={`flex-shrink-0 w-5 h-5 text-[#00132b] transition-transform ${open ? "rotate-180" : ""}`}
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
      {open && (
        <div className="pb-5 pr-8">
          <p className="text-sm text-[#525252] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto px-6 ph:px-12" style={{ maxWidth: "1440px" }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl lg:text-4xl text-[#00132b] mb-10"
            style={{ fontFamily: "\"Optimist\", sans-serif", fontWeight: 700 }}
          >
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
