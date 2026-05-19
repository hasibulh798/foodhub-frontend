import Hero from "@/components/layout/Hero";
import FeaturedCategories from "@/components/modules/home/FeaturedCategories";
import FeaturedRestaurantSection from "@/components/modules/home/FeaturedResturant";
import FoodCardSection from "@/components/modules/home/FoodCardSection";
import FeaturesSection from "@/components/modules/home/Feature";
import ReviewSection from "@/components/modules/home/ReviewSection";
import CTASection from "@/components/modules/home/cta";
import StatsSection from "@/components/modules/home/StatsSection";
import HowItWorks from "@/components/modules/home/HowItWorks";
import BlogSection from "@/components/modules/home/BlogSection";
import FAQSection from "@/components/modules/home/FAQSection";
import NewsletterSection from "@/components/modules/home/NewsletterSection";
import AppPromoSection from "@/components/modules/home/AppPromoSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <StatsSection />
      <FeaturedCategories />
      <HowItWorks />
      <FeaturedRestaurantSection />
      <FoodCardSection />
      <FeaturesSection />
      <AppPromoSection />
      <ReviewSection />
      <BlogSection />
      <FAQSection />
      <CTASection />
      <NewsletterSection />
    </div>
  );
}

