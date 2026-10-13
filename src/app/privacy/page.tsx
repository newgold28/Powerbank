import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects the personal information you share through this website.`,
};

const sections = [
  {
    heading: "Who we are",
    body: `${site.name} ("we", "us") is an event planning and concierge service based in ${site.location}. For any privacy question you can contact us at ${site.email}.`,
  },
  {
    heading: "What we collect",
    body: "When you send a booking enquiry on this website we collect the information you choose to provide: your name, email address, phone number, preferred contact method, and the details of your planned event (such as date, location, guest count, services requested, estimated budget and any notes or reference images you upload).",
  },
  {
    heading: "Why we collect it",
    body: "We use this information solely to review your enquiry, check availability, prepare a quotation and communicate with you about your event. Legal basis: your consent and our legitimate interest in responding to enquiries from prospective clients.",
  },
  {
    heading: "How we store it",
    body: "Enquiry details are stored securely in a protected database (Supabase) and are only accessible to authorised administrators of AbiWande Events & Concierge. Access is protected by authentication and server-side permissions; enquiries are never published on the public website.",
  },
  {
    heading: "Sharing",
    body: "We do not sell or rent your personal information. We only share relevant event details with trusted suppliers if you ask us to co-ordinate a service for your event, and only to the extent needed, never including private notes.",
  },
  {
    heading: "Retention",
    body: "We keep enquiry records for as long as needed to respond to you and, where relevant, to deliver agreed event services. You can ask us to delete your enquiry data at any time by emailing " +
      site.email +
      ".",
  },
  {
    heading: "Cookies and analytics",
    body: "This website does not set marketing cookies. We may use privacy-respecting hosting/analytics logs to understand general traffic. You can block these in your browser.",
  },
  {
    heading: "Your rights",
    body: "Under UK data protection law you have rights to access, correct, delete and restrict use of your personal data. To exercise any right, email " +
      site.email +
      ".",
  },
  {
    heading: "Changes",
    body: "We may update this policy from time to time. The latest version is always available on this page.",
  },
];

export default function PrivacyPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-bronze-dark">
          <span className="inline-block h-px w-10 bg-bronze/70" aria-hidden="true" />
          Privacy Policy
        </p>
        <h1 className="mt-5 font-serif text-5xl leading-[1.02] text-deep sm:text-6xl">
          Your privacy matters
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-charcoal-soft">
          {site.name} is committed to protecting the personal information you
          share with us. This policy explains what we collect and why.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-3xl text-deep">
                {section.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-charcoal-soft">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}