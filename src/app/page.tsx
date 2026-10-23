import type { Metadata } from "next";
import Hero, { type HeroBanner } from "@/components/home/Hero";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import DealsCarousel from "@/components/home/DealsCarousel";
import StoreGallery from "@/components/home/StoreGallery";
import ShopByCategory from "@/components/home/ShopByCategory";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import prisma from "@/lib/prisma";
import { getActiveOccasion, pickBannerProducts, todayInIST, type Occasion } from "@/lib/occasions";
import { getWeeklyCampaign } from "@/lib/weekly-campaigns";
import { getBannerCatalogue } from "@/lib/products";
import { designToOccasion } from "@/lib/banner-templates";
import { TrustBar, BulkOrdersSection, TestimonialsSection, FAQSection, ServiceAreasSection } from "@/components/home/HomeSEOContent";

export const revalidate = 0; // Force immediate updates for settings

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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

  // Banners are generated from code — nothing has to be uploaded for one to go
  // live. The festival calendar lives in src/lib/occasions.ts and the weekly
  // rotation in src/lib/weekly-campaigns.ts; the DB row only holds admin
  // overrides (custom wording, moved dates, or switched off), so this still
  // works when the row is missing or the DB is unreachable.
  const occasionOverrides = Array.isArray(occasionSetting?.value) ? occasionSetting.value : [];

  // The festival leads when one is on; the week's campaign always follows, so
  // the top of the homepage is never more than seven days old.
  const generatedBanners = [
    getActiveOccasion(occasionOverrides),
    getWeeklyCampaign(occasionOverrides),
  ].filter((o): o is Occasion => Boolean(o));

  // Slides made in Admin → Banner Studio are stored in the hero row with a
  // `design` instead of an image, and are drawn by the same component as the
  // generated banners rather than loaded as a picture.
  //
  // A studio slide carries the last day of its offer, and comes off the
  // homepage on its own once that day has passed: a banner still promising
  // "Offer ends 20 Oct" in November does the shop more harm than an empty slot
  // would. Nothing is lost by it — the design stays in the banner library, so
  // Admin → Banner Studio can give it new dates and put it straight back up.
  // Uploaded image slides have no end date and are never hidden.
  const today = todayInIST();
  const liveHeroSlides = Array.isArray(initialHeroSlides)
    ? initialHeroSlides.filter(
        (slide: any) => !slide?.design?.endsOn || slide.design.endsOn >= today
      )
    : initialHeroSlides;

  const studioSlides = Array.isArray(liveHeroSlides)
    ? liveHeroSlides.filter((slide: any) => slide?.design)
    : [];

  // Real deals for every banner to show — the generated ones and any studio
  // slides — all filtered out of a single query. Failing to load them only
  // costs the product strip; each banner still renders from its own copy.
  let banners: HeroBanner[] = generatedBanners.map((occasion) => ({ occasion, products: [] }));

  // Turning a design into a banner needs no database, so it happens before the
  // catalogue is fetched: if that query fails, a studio slide still renders
  // without its product strip rather than falling through to the image branch
  // of the slider, which would leave an empty frame.
  let heroSlides =
    studioSlides.length > 0
      ? liveHeroSlides.map((slide: any) =>
          slide?.design
            ? { ...slide, occasion: designToOccasion(slide.design), products: [] }
            : slide
        )
      : liveHeroSlides;

  if (generatedBanners.length > 0 || studioSlides.length > 0) {
    try {
      const catalogue = await getBannerCatalogue();

      const productsFor = (occasion: Occasion) =>
        pickBannerProducts(
          catalogue,
          { category: occasion.productCategory, brand: occasion.brand },
          3
        );

      banners = generatedBanners.map((occasion) => ({
        occasion,
        products: productsFor(occasion),
      }));

      // A studio slide keeps its place in the slider — the shop ordered it
      // there — so it is filled in rather than hoisted to the front.
      if (studioSlides.length > 0) {
        heroSlides = heroSlides.map((slide: any) =>
          slide?.occasion ? { ...slide, products: productsFor(slide.occasion) } : slide
        );
      }
    } catch (err) {
      console.error("Failed to load banner products:", err);
    }
  }

  return (
    <main>
      <h1 className="sr-only">Raj Electronics — Secunderabad's #1 Electronics Dealer Since 1995</h1>
      <TrustBar />
      <Hero initialSlides={heroSlides} banners={banners} />
      <ShopByCategory />
      <DealsCarousel />
      <BulkOrdersSection />
      <FeaturedBrands />
      <StoreGallery initialImages={initialGalleryImages} />
      <WhyChooseUs />
      <TestimonialsSection />
      <FAQSection />
      <ServiceAreasSection />
    </main>
  );
}

