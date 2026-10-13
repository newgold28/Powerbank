import { Hero } from "@/components/home/hero";
import { ServicesOverview } from "@/components/home/services-overview";
import { FeaturedPortfolio } from "@/components/home/featured-portfolio";
import { WhyAbiWande } from "@/components/home/why-abiwande";
import { HowItWorks } from "@/components/home/how-it-works";
import { ClosingCta } from "@/components/home/closing-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <FeaturedPortfolio />
      <WhyAbiWande />
      <HowItWorks />
      <ClosingCta />
    </>
  );
}