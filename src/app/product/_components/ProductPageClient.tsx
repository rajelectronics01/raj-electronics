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
                alt={product.name} 
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
                  <Image src={img} alt={""} width={80} height={80} style={{ objectFit: 'contain' }} />
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
              <span className={styles.ratingCount}>4.8 (124 Verified Reviews)</span>
              <span className={styles.stockBadge}>In Stock</span>
            </div>

            <div className={styles.priceCard}>
              <div className={styles.priceRow}>
                <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
                {product.originalPrice && <span className={styles.mrp}>{formatPrice(product.originalPrice)}</span>}
              </div>
              <div className={styles.saveAmount}>
                You Save {formatPrice(product.originalPrice ? product.originalPrice - product.price : 0)} 
                ({discount}% OFF)
              </div>
              <div className={styles.emiNotice}>
                No Cost EMI from <strong>₹{Math.round(product.price / 12).toLocaleString('en-IN')}/mo</strong>. Standard EMI also available.
              </div>
            </div>

            <div className={styles.actions}>
              <Link href={`/checkout/${product.id}`} className={styles.buyBtn} style={{textAlign: 'center'}}>
                ⚡ BUY NOW
              </Link>
              <AddToCart product={product} className={styles.cartBtn} />
            </div>

            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <ShieldCheckIcon className={styles.trustIcon} />
                <div className={styles.trustLbl}>1 YEAR<br/>WARRANTY</div>
              </div>
              <div className={styles.trustItem}>
                <AwardIcon className={styles.trustIcon} />
                <div className={styles.trustLbl}>BEST<br/>PRICES</div>
              </div>
              <div className={styles.trustItem}>
                <AwardIcon className={styles.trustIcon} />
                <div className={styles.trustLbl}>GENUINE<br/>PRODUCT</div>
              </div>
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
            <div 
              className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ""}`}
              onClick={() => setActiveTab('reviews')}
            >Reviews</div>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div style={{animation: 'fadeIn 0.3s ease'}}>
                <h3 style={{marginBottom: '15px'}}>Why choose this {product.brand} product?</h3>
                <ul style={{lineHeight: '1.8', color: 'var(--g600)'}}>
                  {product.features.map((f: string, i: number) => (
                    <li key={i}>✅ {f}</li>
                  ))}
                  <li>✅ Energy efficient design for lower power bills.</li>
                  <li>✅ Best-in-class performance and long durability.</li>
                  <li>✅ Authorized service support across Secunderabad.</li>
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

            {activeTab === 'reviews' && (
              <div className={styles.reviewSummary}>
                <div className={styles.bigRating}>
                  <div className={styles.ratingNum}>4.8</div>
                  <div className={styles.stars}>
                    {[1,2,3,4,5].map(i => <StarIcon key={i} width={16} height={16} />)}
                  </div>
                  <div style={{fontSize: '12px', color: 'var(--g400)', marginTop: '5px'}}>124 Reviews</div>
                </div>
                <div className={styles.ratingBars}>
                  {[5,4,3,2,1].map(lvl => (
                    <div key={lvl} className={styles.barRow}>
                      <span className={styles.barLabel}>{lvl}★</span>
                      <div className={styles.bar}><div className={styles.barFill} style={{width: lvl === 5 ? '85%' : lvl === 4 ? '12%' : '1%'}}></div></div>
                    </div>
                  ))}
                </div>
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
              <img src={product.images[0]} alt="" />
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
