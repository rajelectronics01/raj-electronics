import Hero from "@/components/home/Hero";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StoreGallery from "@/components/home/StoreGallery";
import Reviews from "@/components/home/Reviews";
import ShopByCategory from "@/components/home/ShopByCategory";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <Hero />
      <StoreGallery />
      <FeaturedBrands />
      <ShopByCategory />
      <FeaturedProducts />
      <WhyChooseUs />
      <Reviews />

      <div style={{ height: '400px', width: '100%' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2766788876!2d78.498!3d17.447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzQ5LjIiTiA3OMKwMjknNTIuOCJF!5e0!3m2!1sen!2sin!4v1625555555555!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy">
        </iframe>
      </div>

      <WhatsAppButton />
    </main>
  );
}
