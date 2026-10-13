import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Gallery } from "@/components/portfolio/gallery";
import { Container } from "@/components/ui/container";
import { getDbPortfolioItems } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "View photographs of events and celebrations styled and coordinated by AbiWande Events & Concierge in Manchester.",
};

export default async function PortfolioPage() {
  const extraItems = await getDbPortfolioItems();
  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title="The moments we help bring to life"
        description="A growing gallery of event styling, décor, catering and celebration details. Images will be captioned and categorised with authentic project information as the portfolio grows."
      />
      <Container className="py-14 sm:py-20">
        <div id="gallery">
          <Gallery extraItems={extraItems} />
        </div>
      </Container>
    </>
  );
}