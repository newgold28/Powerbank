/**
 * PORTFOLIO — EDITABLE CONTENT
 * ============================
 * Each entry maps to an optimised image in /public/images/portfolio.
 * Fill in the fields below so the gallery reflects your genuine work:
 *
 *   title       A short project title, e.g. "Amara & Tunde's Wedding"
 *   category    One of: Weddings | Luxury Events | Birthdays |
 *               Corporate Events | Catering | Traditional Celebrations |
 *               Photography & Videography | Cakes & Desserts
 *   caption     A one-line description of the image
 *   location    Optional venue or town (leave "" if unknown)
 *   date        Optional event date, e.g. "August 2025"
 *
 * Images are currently unlabelled ("Events") so nothing is misrepresented.
 * To add more photos: drop optimised JPGs into /public/images/portfolio,
 * then add an entry below. The owner dashboard can also manage portfolio
 * items once Supabase is connected.
 */
export type PortfolioCategory =
  | "Weddings"
  | "Luxury Events"
  | "Birthdays"
  | "Corporate Events"
  | "Catering"
  | "Traditional Celebrations"
  | "Photography & Videography"
  | "Cakes & Desserts";

export interface PortfolioItem {
  id: string;
  src: string;
  category: string;
  title: string;
  caption: string;
  location: string;
  date: string;
}

export const portfolioCategories: PortfolioCategory[] = [
  "Weddings",
  "Luxury Events",
  "Birthdays",
  "Corporate Events",
  "Catering",
  "Traditional Celebrations",
  "Photography & Videography",
  "Cakes & Desserts",
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "01",
    src: "/images/portfolio/portfolio-01.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "02",
    src: "/images/portfolio/portfolio-02.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "03",
    src: "/images/portfolio/portfolio-03.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "04",
    src: "/images/portfolio/portfolio-04.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "05",
    src: "/images/portfolio/portfolio-05.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "06",
    src: "/images/portfolio/portfolio-06.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "07",
    src: "/images/portfolio/portfolio-07.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "08",
    src: "/images/portfolio/portfolio-08.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "09",
    src: "/images/portfolio/portfolio-09.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "10",
    src: "/images/portfolio/portfolio-10.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "11",
    src: "/images/portfolio/portfolio-11.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "12",
    src: "/images/portfolio/portfolio-12.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "13",
    src: "/images/portfolio/portfolio-13.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "14",
    src: "/images/portfolio/portfolio-14.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "15",
    src: "/images/portfolio/portfolio-15.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "16",
    src: "/images/portfolio/portfolio-16.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "17",
    src: "/images/portfolio/portfolio-17.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "18",
    src: "/images/portfolio/portfolio-18.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "19",
    src: "/images/portfolio/portfolio-19.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "20",
    src: "/images/portfolio/portfolio-20.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "21",
    src: "/images/portfolio/portfolio-21.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "22",
    src: "/images/portfolio/portfolio-22.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "23",
    src: "/images/portfolio/portfolio-23.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "24",
    src: "/images/portfolio/portfolio-24.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "25",
    src: "/images/portfolio/portfolio-25.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "26",
    src: "/images/portfolio/portfolio-26.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "27",
    src: "/images/portfolio/portfolio-27.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "28",
    src: "/images/portfolio/portfolio-28.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "29",
    src: "/images/portfolio/portfolio-29.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "30",
    src: "/images/portfolio/portfolio-30.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "31",
    src: "/images/portfolio/portfolio-31.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "32",
    src: "/images/portfolio/portfolio-32.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "33",
    src: "/images/portfolio/portfolio-33.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "34",
    src: "/images/portfolio/portfolio-34.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "35",
    src: "/images/portfolio/portfolio-35.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "36",
    src: "/images/portfolio/portfolio-36.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "37",
    src: "/images/portfolio/portfolio-37.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "38",
    src: "/images/portfolio/portfolio-38.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "39",
    src: "/images/portfolio/portfolio-39.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
  {
    id: "40",
    src: "/images/portfolio/portfolio-40.jpg",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },
];

export function getPortfolioItems() {
  return portfolioItems;
}
