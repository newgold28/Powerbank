export const site = {
  name: "AbiWande Events & Concierge",
  shortName: "AbiWande",
  tagline: "You Celebrate, We Handle the Rest.",
  location: "Manchester, UK",
  phoneDisplay: "07727 642087",
  phoneHref: "tel:+447727642087",
  whatsappHref:
    "https://wa.me/447727642087?text=" +
    encodeURIComponent(
      "Hello AbiWande Events & Concierge, I would like to enquire about planning an event. Please let me know how we can get started."
    ),
  email: "bookings.abiwandeevents@gmail.com",
  emailHref: "mailto:bookings.abiwandeevents@gmail.com",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Manchester%2C%20UK",
  hero:
    "Luxury weddings, traditional celebrations and refined events in Manchester — planned, styled and delivered with care.",
  description:
    "AbiWande Events & Concierge is a Manchester-based event planning and concierge service. We help clients bring together everything a celebration needs — from weddings and birthdays to corporate events.",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/portfolio" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const bookingPath = "/book";
export const privacyPath = "/privacy";