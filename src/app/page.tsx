import Hero from "@/components/home/Hero";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StoreGallery from "@/components/home/StoreGallery";
import Reviews from "@/components/home/Reviews";
import ShopByCategory from "@/components/home/ShopByCategory";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import prisma from "@/lib/prisma";

export const revalidate = 0; // Force immediate updates for settings

export default async function Home() {
  // Fetch site settings concurrently for Hero and Gallery
  const [heroSetting, gallerySetting] = await Promise.all([
    (prisma as any).storeSetting.findUnique({ where: { key: 'hero' } }),
    (prisma as any).storeSetting.findUnique({ where: { key: 'gallery' } })
  ]);

  const initialHeroSlides = heroSetting ? heroSetting.value : null;
  const initialGalleryImages = gallerySetting ? gallerySetting.value : null;

  return (
    <main>
      <Hero initialSlides={initialHeroSlides} />
      <ShopByCategory />
      <FeaturedProducts />
      <FeaturedBrands />
      <StoreGallery initialImages={initialGalleryImages} />
      <WhyChooseUs />
      <Reviews />
    </main>
  );
}
