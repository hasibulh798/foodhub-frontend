import CTASection from "@/components/modules/home/cta";
import FeaturesSection from "@/components/modules/home/Feature";
import FeaturedRestaurantSection from "@/components/modules/home/FeaturedResturant";
import CategoriesSection from "@/components/layout/Categories";
import Hero from "@/components/layout/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedRestaurantSection />
      <FeaturesSection />
      <CategoriesSection />
      <CTASection />
    </>
  );
}
