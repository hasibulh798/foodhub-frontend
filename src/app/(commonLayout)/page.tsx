import CTASection from "@/components/modules/home/cta";
import FeaturesSection from "@/components/modules/home/Feature";
import FeaturedRestaurantSection from "@/components/modules/home/FeaturedResturant";
import ReviewSection from "@/components/modules/home/ReviewSection";
import Hero from "@/components/layout/Hero";
import FeaturedCategories from "@/components/modules/home/FeaturedCategories";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedRestaurantSection />
      <FeaturesSection />
      <ReviewSection />
      <CTASection />
    </>
  );
}

