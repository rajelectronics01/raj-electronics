import Hero from "@/components/home/Hero";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import DealsCarousel from "@/components/home/DealsCarousel";
import StoreGallery from "@/components/home/StoreGallery";
import Reviews from "@/components/home/Reviews";
import ShopByCategory from "@/components/home/ShopByCategory";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import prisma from "@/lib/prisma";

export const revalidate = 0; // Force immediate updates for settings

export default async function Home() {
  // Fetch site settings concurrently for Hero and Gallery with safety fallback
  let heroSetting = null;
  let gallerySetting = null;
  
  try {
    const [h, g] = await Promise.all([
      (prisma as any).storeSetting.findUnique({ where: { key: 'hero' } }),
      (prisma as any).storeSetting.findUnique({ where: { key: 'gallery' } })
    ]);
    heroSetting = h;
    gallerySetting = g;
  } catch (err) {
    console.error("Failed to fetch store settings from DB:", err);
    // Continue with nulls, components will use DEFAULT_SLIDES
  }

  const initialHeroSlides = heroSetting ? (heroSetting as any).value : null;
  const initialGalleryImages = gallerySetting ? (gallerySetting as any).value : null;

  return (
    <main>
      <Hero initialSlides={initialHeroSlides} />
      <ShopByCategory />
      <DealsCarousel />
      <FeaturedBrands />
      <StoreGallery initialImages={initialGalleryImages} />
      <WhyChooseUs />
      <Reviews />
    </main>
  );
}
