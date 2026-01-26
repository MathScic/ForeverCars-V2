import CTASection from "@/components/home/CTASection";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ValueProposition from "@/components/home/ValueProposition";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProposition />
      <FeaturedVehicles />
      <HowItWorks />
      <CTASection />
    </>
  );
}
