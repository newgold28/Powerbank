export type ServiceGroup =
  | "Event Planning"
  | "Entertainment"
  | "Food & Hospitality"
  | "Photography & Event Presentation"
  | "Event Essentials";

export interface Service {
  id: string;
  title: string;
  short: string;
  description: string;
  group: ServiceGroup;
  enquireLabel: string;
}

export const serviceGroups: {
  name: ServiceGroup;
  description: string;
}[] = [
  {
    name: "Event Planning",
    description:
      "End-to-end planning and coordination for celebrations large and small, designed around your vision.",
  },
  {
    name: "Entertainment",
    description:
      "A coordinated line-up of musicians, DJs and hosts so the atmosphere stays exactly right, all night.",
  },
  {
    name: "Food & Hospitality",
    description:
      "Exceptional catering and hospitality, from traditional Nigerian dishes to weddings-worthiness of cakes and cocktails.",
  },
  {
    name: "Photography & Event Presentation",
    description:
      "Capturing the day beautifully, dressing guests in regal tradition, and designing every piece of your celebration.",
  },
  {
    name: "Event Essentials",
    description:
      "The practical pieces that make an event effortless — venues, souvenirs and gifts.",
  },
];

export const services: Service[] = [
  {
    id: "luxury-events",
    title: "Luxury Events",
    short: "Refined celebrations styled to feel effortless and unforgettable.",
    description:
      "Private parties and high-end celebrations planned with a meticulous eye for detail, elegant styling and seamless delivery.",
    group: "Event Planning",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "weddings",
    title: "Weddings",
    short: "From engagement to the big day, planned with heart and precision.",
    description:
      "Full or tailored wedding coordination — venue sourcing, décor direction, supplier coordination and on-the-day management, including traditional Nigerian and African wedding celebrations.",
    group: "Event Planning",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "birthdays",
    title: "Birthdays",
    short: "Personal, joyful celebrations for every milestone.",
    description:
      "Intimate dinners to grand milestone parties, with themes, styling, entertainment and catering arranged around the guest of honour.",
    group: "Event Planning",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "corporate-events",
    title: "Corporate Events",
    short: "Professional occasions delivered with polish.",
    description:
      "Conferences, launches, parties and client events handled with professionalism, clear coordination and attention to detail.",
    group: "Event Planning",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "african-live-bands",
    title: "African Live Bands",
    short: "Live bands that set the tone with energy and soul.",
    description:
      "Coordinated bookings with talented African live bands — highlife, juju, Afrobeats and more — matched to the mood of your celebration.",
    group: "Entertainment",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "afro-djs",
    title: "Afro DJs",
    short: "Afrobeats and beyond, spinning sets that keep guests dancing.",
    description:
      "Experienced Afro DJs and sound systems to keep your celebration alive from the first track to the last.",
    group: "Entertainment",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "professional-mcs",
    title: "Professional MCs",
    short: "Confident hosts who guide your event with warmth.",
    description:
      "Skilled masters of ceremony who keep your programme flowing, engage your guests and highlight every special moment.",
    group: "Entertainment",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "catering",
    title: "Catering — African & Intercontinental Cuisine",
    short: "Menus that comfort, impress and bring people together.",
    description:
      "Tailored catering for all tastes, from rich African classics to elegant intercontinental dishes — all presented beautifully.",
    group: "Food & Hospitality",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "amala-and-gbegiri",
    title: "Amala & Gbegiri Specialists",
    short: "The beloved classic, done the way it should be.",
    description:
      "Authentic Amala and Gbegiri, prepared with care by specialists who know the dish — a crowd favourite at Nigerian celebrations.",
    group: "Food & Hospitality",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "small-chops-and-cocktails",
    title: "Small Chops & Cocktails",
    short: "Bite-size treats and drinks to start the celebration.",
    description:
      "Small chops platters, canapés and handcrafted cocktails — the perfect way to welcome guests and set the tone.",
    group: "Food & Hospitality",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "cakes-and-desserts",
    title: "Cakes & Desserts",
    short: "Centrepieces as beautiful as they are delicious.",
    description:
      "Custom celebration cakes and dessert tables designed to match your theme, from elegant tiers to showstopping display cakes.",
    group: "Food & Hospitality",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "photography-and-videography",
    title: "Photography & Videography",
    short: "Beautifully captured memories you will keep forever.",
    description:
      "Professional photography and videography packages arranged to document every detail of your day without you lifting a finger.",
    group: "Photography & Event Presentation",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "aso-oke-and-traditional-attire",
    title: "Aso Oke & Traditional Attire",
    short: "Regal fabrics and traditional fashion for the occasion.",
    description:
      "We help you source Aso Oke and coordinate traditional attire for your celebration, so the whole party looks the part.",
    group: "Photography & Event Presentation",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "graphic-design-and-printing",
    title: "Graphic Design & Printing — IVs, Stickers & Banners",
    short: "Designs and printed pieces that announce your event beautifully.",
    description:
      "Invitation cards (IVs), stickers, banners and branding designed and printed to match the style of your celebration.",
    group: "Photography & Event Presentation",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "affordable-event-halls",
    title: "Affordable Event Halls",
    short: "The right venue, sourced and secured for you.",
    description:
      "We help you find and secure affordable venues that suit your guest list, style and budget — nothing to chase yourself.",
    group: "Event Essentials",
    enquireLabel: "Enquire About This Service",
  },
  {
    id: "souvenirs-and-gift-items",
    title: "Souvenirs & Gift Items",
    short: "Thoughtful keepsakes your guests will love.",
    description:
      "Custom souvenirs and gift items for your guests, designed around your theme and budget.",
    group: "Event Essentials",
    enquireLabel: "Enquire About This Service",
  },
];

export const fullCoordinationService: Service = {
  id: "full-event-coordination",
  title: "Full Event Coordination",
  short: "Let us plan, coordinate and deliver your entire event end to end.",
  description:
    "Our complete coordination service handles the planning, suppliers, styling and on-the-day management for your whole event — so you can simply enjoy it.",
  group: "Event Planning",
  enquireLabel: "Request This Service",
};

export function serviceById(id: string): Service | undefined {
  return services.find((s) => s.id === id) ?? (id === "full-event-coordination" ? fullCoordinationService : undefined);
}

export function enquireHref(selection: string) {
  const id = selection.trim().replace(/\s+/g, "-").toLowerCase();
  return `/book?service=${encodeURIComponent(id)}`;
}

export function serviceDisplayName(id: string) {
  const match = serviceById(id);
  if (match) return match.title;
  return id.toLowerCase().replace(/-/g, " ");
}