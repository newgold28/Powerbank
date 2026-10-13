import { writeFileSync } from "node:fs";

const manifest = {
  "portfolio-01": "WhatsApp Image 2026-10-06 at 17.27.48 (1).jpeg",
  "portfolio-02": "WhatsApp Image 2026-10-06 at 17.27.48.jpeg",
  "portfolio-03": "WhatsApp Image 2026-10-06 at 17.28.00.jpeg",
  "portfolio-04": "WhatsApp Image 2026-10-06 at 17.28.07.jpeg",
  "portfolio-05": "WhatsApp Image 2026-10-06 at 17.30.00 (1).jpeg",
  "portfolio-06": "WhatsApp Image 2026-10-06 at 17.30.00 (2).jpeg",
  "portfolio-07": "WhatsApp Image 2026-10-06 at 17.30.00 (3).jpeg",
  "portfolio-08": "WhatsApp Image 2026-10-06 at 17.30.00.jpeg",
  "portfolio-09": "WhatsApp Image 2026-10-06 at 17.30.01 (1).jpeg",
  "portfolio-10": "WhatsApp Image 2026-10-06 at 17.30.01 (2).jpeg",
  "portfolio-11": "WhatsApp Image 2026-10-06 at 17.30.01 (3).jpeg",
  "portfolio-12": "WhatsApp Image 2026-10-06 at 17.30.01 (4).jpeg",
  "portfolio-13": "WhatsApp Image 2026-10-06 at 17.30.01 (5).jpeg",
  "portfolio-14": "WhatsApp Image 2026-10-06 at 17.30.01 (6).jpeg",
  "portfolio-15": "WhatsApp Image 2026-10-06 at 17.30.01.jpeg",
  "portfolio-16": "WhatsApp Image 2026-10-06 at 17.30.02 (1).jpeg",
  "portfolio-17": "WhatsApp Image 2026-10-06 at 17.30.02 (2).jpeg",
  "portfolio-18": "WhatsApp Image 2026-10-06 at 17.30.02 (3).jpeg",
  "portfolio-19": "WhatsApp Image 2026-10-06 at 17.30.02 (4).jpeg",
  "portfolio-20": "WhatsApp Image 2026-10-06 at 17.30.02 (5).jpeg",
  "portfolio-21": "WhatsApp Image 2026-10-06 at 17.30.02 (6).jpeg",
  "portfolio-22": "WhatsApp Image 2026-10-06 at 17.30.02.jpeg",
  "portfolio-23": "WhatsApp Image 2026-10-06 at 17.30.03 (1).jpeg",
  "portfolio-24": "WhatsApp Image 2026-10-06 at 17.30.03 (2).jpeg",
  "portfolio-25": "WhatsApp Image 2026-10-06 at 17.30.03 (3).jpeg",
  "portfolio-26": "WhatsApp Image 2026-10-06 at 17.30.03.jpeg",
  "portfolio-27": "WhatsApp Image 2026-10-06 at 17.30.04 (1).jpeg",
  "portfolio-28": "WhatsApp Image 2026-10-06 at 17.30.04 (2).jpeg",
  "portfolio-29": "WhatsApp Image 2026-10-06 at 17.30.04.jpeg",
  "portfolio-30": "WhatsApp Image 2026-10-06 at 17.30.05 (1).jpeg",
  "portfolio-31": "WhatsApp Image 2026-10-06 at 17.30.05 (2).jpeg",
  "portfolio-32": "WhatsApp Image 2026-10-06 at 17.30.05.jpeg",
  "portfolio-33": "WhatsApp Image 2026-10-06 at 17.30.06.jpeg",
  "portfolio-34": "WhatsApp Image 2026-10-06 at 17.30.07 (1).jpeg",
  "portfolio-35": "WhatsApp Image 2026-10-06 at 17.30.07 (2).jpeg",
  "portfolio-36": "WhatsApp Image 2026-10-06 at 17.30.07.jpeg",
  "portfolio-37": "WhatsApp Image 2026-10-06 at 17.30.08 (1).jpeg",
  "portfolio-38": "WhatsApp Image 2026-10-06 at 17.30.08 (2).jpeg",
  "portfolio-39": "WhatsApp Image 2026-10-06 at 17.30.08.jpeg",
  "portfolio-40": "WhatsApp Image 2026-10-06 at 17.30.09.jpeg",
};

const entries = Object.keys(manifest).map((key, i) => {
  const src = `portfolio-${String(i + 1).padStart(2, "0")}.jpg`;
  return `  {
    id: "${key.slice(-2)}",
    src: "/images/portfolio/${src}",
    category: "Events",
    title: "",
    caption: "",
    location: "",
    date: "",
  },`;
}).join("\n");

const content = `/**
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
${entries}
];

export function getPortfolioItems() {
  return portfolioItems;
}
`;

writeFileSync(
  "/Users/paschal/abiwande-website/src/content/portfolio.ts",
  content
);
console.log("portfolio.ts written with", Object.keys(manifest).length, "entries");