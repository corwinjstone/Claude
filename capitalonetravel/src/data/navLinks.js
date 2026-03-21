export const navLinks = [
  { label: "Travel benefits", href: "/consumer-travel-benefits" },
  { label: "Business travel", href: "/business-travel" },
  {
    label: "Premium stays",
    href: "",
    subGroups: [
      {
        heading: "Premier Collection",
        headingHref: "/premier-collection",
        description: "Explore world-class luxury hotels and homes with cardholder benefits.",
        links: [
          { label: "Hotels & resorts", href: "/premier-collection" },
          { label: "Vacation rentals", href: "/premier-collection-vacation-rentals" },
        ],
      },
      {
        heading: "Lifestyle Collection",
        headingHref: "/lifestyle-collection",
        description: "Discover vibrant, one-of-a-kind hotels and homes with cardholder benefits.",
        links: [
          { label: "Hotels & resorts", href: "/lifestyle-collection" },
          { label: "Vacation rentals", href: "/lifestyle-collection-vacation-rentals" },
        ],
      },
    ],
  },
  { label: "Airport lounges", href: "/airport-lounges" },
  { label: "Tips & planning", href: "/tips-and-planning" },
];
