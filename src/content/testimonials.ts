/**
 * TESTIMONIALS — EDITABLE CONTENT
 * ===============================
 * Add genuine client reviews here when you collect them, for example:
 *
 * {
 *   quote: "...",
 *   name: "Client first name",
 *   event: "Wedding, Manchester",
 * }
 *
 * The homepage only renders this section when the array is non-empty, so no
 * testimonials are shown until real ones are added.
 */
export interface Testimonial {
  quote: string;
  name: string;
  event: string;
}

export const testimonials: Testimonial[] = [];