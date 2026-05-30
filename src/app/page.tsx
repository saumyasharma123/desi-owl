import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { InstagramSection } from "@/components/home/InstagramSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts
          title="Featured Collection"
          subtitle="Handpicked pieces for the discerning you"
          type="featured"
          limit={8}
        />
        <CategoriesSection />
        <FeaturedProducts
          title="New Arrivals"
          subtitle="Fresh styles just for you"
          type="new"
          limit={8}
        />
        <InstagramSection />
      </main>
      <Footer />
    </div>
  );
}
