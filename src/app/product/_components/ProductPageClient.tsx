"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../[slug]/page.module.css";
import { formatPrice } from "@/lib/utils";
import { 
  StarIcon, ShieldCheckIcon, RefreshCcwIcon, 
  TruckIcon, AwardIcon, ShoppingCartIcon 
} from "@/components/icons/Icons";
import AddToCart from "@/components/product/AddToCart";
import ProductCard from "@/components/product/ProductCard";

interface ProductPageClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={styles.page}>
      <div className={styles.topBanner}>
        ⚡ FASTEST DELIVERY IN SECUNDERABAD • AUTHORIZED {product.brand.toUpperCase()} PARTNER
      </div>

      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link> / 
          <Link href={`/category/${product.category}`}>{product.category}</Link> / 
          <span>{product.name}</span>
        </div>

        <div className={styles.heroGrid}>
          {/* GALLERY */}
          <div className={styles.gallerySection}>
            <div className={styles.mainImageCard}>
              {discount > 0 && <div className={styles.discountTag}>{discount}% OFF</div>}
              <Image 
                src={activeImg} 
                alt={`${product.brand} ${product.name} - Buy in Secunderabad Hyderabad`} 
                width={500} 
                height={500} 
                className={styles.mainImage}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className={styles.thumbnails}>
              {product.images.map((img: string, i: number) => (
                <div 
                  key={i} 
                  className={`${styles.thumb} ${activeImg === img ? styles.active : ""}`}
                  onClick={() => setActiveImg(img)}
                >
                  <Image src={img} alt={`${product.brand} ${product.name} - Buy in Secunderabad Hyderabad`} width={80} height={80} style={{ objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className={styles.infoSection}>
            <div className={styles.brandTag}>{product.brand}</div>
            <h1 className={styles.title}>{product.name}</h1>
            
            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
              </div>
              <span className={styles.ratingCount}>4.8 (124 Ratings & 60 Reviews)</span>
            </div>

            <div className={styles.priceCard}>
              <div className={styles.priceRow}>
                <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className={styles.mrp}>MRP {formatPrice(product.originalPrice)}</span>
                    <span className={styles.discountPillSmall}>{discount}% off</span>
                  </>
                )}
                <span className={styles.taxesLabel}>(Incl. of all taxes)</span>
              </div>
              
              <div className={styles.deliveryRow}>
                <div className={styles.stockBadge}>
                  <ShieldCheckIcon width={16} height={16} /> In stock
                </div>
              </div>

              <div className={styles.actionRow}>
                <div className={styles.qtySelect}>
                  Qty <select style={{background:'transparent', border: 'none', outline: 'none', fontWeight: 600}}><option>1</option><option>2</option><option>3</option></select>
                </div>
                <AddToCart product={product} className={styles.addToCartBtn} />
                <Link href={`/checkout/${product.id}`} className={styles.buyNowBtn} style={{background: '#1e293b'}}>
                  Buy Now
                </Link>
              </div>
            </div>

            {/* GUARANTEES */}
            <div className={styles.guarantees}>
              {["Authorized Dealer", "GST Invoice", "30 Years Legacy", "Bulk Orders Accepted"].map(badge => (
                <span key={badge} className={styles.guaranteeBadge}>
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className={styles.contentSection}>
          <div className={styles.tabs}>
            <div 
              className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ""}`}
              onClick={() => setActiveTab('overview')}
            >Overview</div>
            <div 
              className={`${styles.tab} ${activeTab === 'specs' ? styles.active : ""}`}
              onClick={() => setActiveTab('specs')}
            >Specification</div>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div style={{animation: 'fadeIn 0.3s ease'}}>
                <h3 style={{marginBottom: '15px', fontSize: '1.2rem', fontWeight: 700}}>Why choose this {product.brand} product?</h3>
                <ul style={{lineHeight: '1.8', color: '#4b5563', fontSize: '0.95rem'}}>
                  {product.features.map((f: string, i: number) => (
                    <li key={i} style={{marginBottom: '8px'}}>✅ {f}</li>
                  ))}
                  <li style={{marginBottom: '8px'}}>✅ Energy efficient design for lower power bills.</li>
                  <li style={{marginBottom: '8px'}}>✅ Best-in-class performance and long durability.</li>
                  <li style={{marginBottom: '8px'}}>✅ Authorized service support across Secunderabad.</li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className={styles.specsGrid}>
                <div className={styles.specRow}><span className={styles.specLbl}>Brand</span><span className={styles.specVal}>{product.brand}</span></div>
                <div className={styles.specRow}><span className={styles.specLbl}>Category</span><span className={styles.specVal}>{product.category}</span></div>
                <div className={styles.specRow}><span className={styles.specLbl}>Model Year</span><span className={styles.specVal}>2024</span></div>
                <div className={styles.specRow}><span className={styles.specLbl}>Installation</span><span className={styles.specVal}>Free In-Store</span></div>
                <div className={styles.specRow}><span className={styles.specLbl}>Warranty</span><span className={styles.specVal}>1 Year Brand Warranty</span></div>
                <div className={styles.specRow}><span className={styles.specLbl}>Availability</span><span className={styles.specVal}>Secunderabad Only</span></div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div style={{marginTop: '80px'}}>
            <h2 style={{fontSize: '24px', fontWeight: 800, marginBottom: '30px', color: 'var(--g900)'}}>Customers also viewed</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px'}}>
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM BAR */}
      <div className={`${styles.stickyBar} ${showSticky ? "" : "hidden"}`} style={{ display: showSticky ? 'block' : 'none' }}>
        <div className={styles.container}>
          <div className={styles.stickyInner}>
            <div className={styles.stickyProd}>
              <img src={product.images[0]} alt={`${product.brand} ${product.name} - Buy in Secunderabad Hyderabad`} />

              <div>
                <div className={styles.stickyTitle}>{product.name}</div>
                <div style={{fontSize: '12px', color: 'var(--green)', fontWeight: 700}}>Authorized Dealer • In Stock</div>
              </div>
            </div>
            <div className={styles.stickyPrice}>
              <div style={{textAlign: 'right'}}>
                <div className={styles.spAmt}>{formatPrice(product.price)}</div>
                {product.originalPrice && <div className={styles.smrp}>{formatPrice(product.originalPrice)}</div>}
              </div>
              <Link href={`/checkout/${product.id}`} className={styles.buyBtn} style={{padding: '12px 24px', fontSize: '14px'}}>
                PLACE ORDER NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
