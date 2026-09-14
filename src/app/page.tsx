import Hero from "@/components/home/Hero";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import DealsCarousel from "@/components/home/DealsCarousel";
import StoreGallery from "@/components/home/StoreGallery";
import Reviews from "@/components/home/Reviews";
import ShopByCategory from "@/components/home/ShopByCategory";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import prisma from "@/lib/prisma";
import { getActiveOccasion } from "@/lib/occasions";
import { getOccasionProducts } from "@/lib/products";
import type { BannerProduct } from "@/lib/occasions";

export const revalidate = 0; // Force immediate updates for settings

export default async function Home() {
  // Fetch site settings concurrently for Hero and Gallery with safety fallback
  let heroSetting = null;
  let gallerySetting = null;
  let occasionSetting = null;

  try {
    const [h, g, o] = await Promise.all([
      (prisma as any).storeSetting.findUnique({ where: { key: 'hero' } }),
      (prisma as any).storeSetting.findUnique({ where: { key: 'gallery' } }),
      (prisma as any).storeSetting.findUnique({ where: { key: 'occasions' } })
    ]);
    heroSetting = h;
    gallerySetting = g;
    occasionSetting = o;
  } catch (err) {
    console.error("Failed to fetch store settings from DB:", err);
    // Continue with nulls, components will use DEFAULT_SLIDES
  }

  const initialHeroSlides = heroSetting ? (heroSetting as any).value : null;
  const initialGalleryImages = gallerySetting ? (gallerySetting as any).value : null;

  // Festival banners are generated from the calendar in src/lib/occasions.ts —
  // nothing has to be uploaded for one to go live on the day. The DB row only
  // holds admin overrides (custom wording, moved dates, or switched off), so
  // this still works when the row is missing or the DB is unreachable.
  const activeOccasion = getActiveOccasion(
    Array.isArray(occasionSetting?.value) ? occasionSetting.value : []
  );

  // Real deals for the banner to show. Failing to load them only costs the
  // product strip — the banner still renders from the occasion alone.
  let occasionProducts: BannerProduct[] = [];
  if (activeOccasion) {
    try {
      occasionProducts = await getOccasionProducts(activeOccasion.productCategory, 3);
    } catch (err) {
      console.error("Failed to load occasion banner products:", err);
    }
  }

  return (
    <main>
      <Hero
        initialSlides={initialHeroSlides}
        occasion={activeOccasion}
        occasionProducts={occasionProducts}
      />
      <ShopByCategory />
      <DealsCarousel />
      <FeaturedBrands />
      <StoreGallery initialImages={initialGalleryImages} />
      <WhyChooseUs />
      <Reviews />
    </main>
  );
}
