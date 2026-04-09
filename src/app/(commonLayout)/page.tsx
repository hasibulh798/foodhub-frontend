import CTASection from "@/components/modules/home/cta";
import FeaturesSection from "@/components/modules/home/Feature";
import FeaturedRestaurantSection from "@/components/modules/home/FeaturedResturant";
import ReviewSection from "@/components/modules/home/ReviewSection";
import Hero from "@/components/layout/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedRestaurantSection />
      <FeaturesSection />
      <ReviewSection />
      <CTASection />
    </>
  );
}
