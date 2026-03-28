import styles from './HomeSEOContent.module.css';
import Link from 'next/link';
import GoogleReviewBanner from './GoogleReviewBanner';

export function TrustBar() {
  const points = [
    "Authorized Brands Dealer",
    "30+ Years Legacy",
    "Bulk Procurement Hub",
    "Valid GST Billing",
    "Priority After-Sales"
  ];
  return (
    <div className={styles.trustBar}>
      <div className={styles.trustContainer}>
        {points.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <span className={styles.trustPoint}>{p}</span>
            {i !== points.length - 1 && <span style={{ color: '#334155', fontSize: '0.6rem' }}>●</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BulkOrdersSection() {
  return (
    <section className={styles.bulkSection}>
      <div className={styles.container}>
        <div className={styles.bulkCard}>
          <h2 className={styles.sectionTitle}>Bulk Orders & Institutional Supply — We Cater to Businesses, Schools, Hospitals & Housing Societies</h2>
          <p className={styles.bulkText}>
            Raj Electronics is Secunderabad's preferred partner for bulk electronics procurement. Whether you're outfitting a corporate office, school, hospital, hotel, PG accommodation, government institution, or housing society — we offer competitive pricing, flexible delivery, and dedicated after-sales support. Bulk orders accepted. Institutional orders welcome. GST billing available.
          </p>
          <div className="sr-only">
             <span>bulk AC purchase Hyderabad</span>
             <span>institutional electronics supplier Secunderabad</span>
             <span>corporate appliance procurement Telangana</span>
             <span>wholesale electronics dealer Hyderabad</span>
             <span>bulk TV purchase for office</span>
             <span>school AC supplier Hyderabad</span>
             <span>hospital appliances supplier</span>
             <span>bulk order electronics GST billing India</span>
          </div>
          <Link href="/bulk-orders" className={styles.bulkCta}>
            Get a Bulk Quote →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {

  const reviews = [
    { name: "Suresh Rao", text: "Got the best price in Secunderabad for my new AC. Fast delivery and genuine product. Highly recommended!" },
    { name: "KV High School", text: "Seamless institutional procurement for our school. Professional service and best wholesale rates for bulk electronics." },
    { name: "Rahul Sharma", text: "Excellent bulk order experience for our new apartment complex. Installation support was top-notch." },
    { name: "Anjali Gupta", text: "Authorized dealer with genuine warranty. The prices are much better than any online marketplace." },
    { name: "Vertex Corporate Office", text: "Efficient corporate procurement. GST billing and timely delivery for all our office appliances." }
  ];
  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <GoogleReviewBanner />

        <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
        <div className={styles.testimonialGrid}>
          {reviews.map((r, i) => (
            <div key={i} className={styles.testimonialCard}>
              <p>"{r.text}"</p>
              <h4>- {r.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const faqs = [
    { q: "Do you accept bulk orders?", a: "Yes, we are Secunderabad's main center for bulk and institutional orders. We supply schools, hospitals, and offices." },
    { q: "Do you provide GST invoice?", a: "Yes, we provide valid GST invoices for all institutional and retail purchases to help you claim tax benefits." },
    { q: "Do you do home delivery in Hyderabad?", a: "Yes, we offer fast and reliable home delivery across Hyderabad and Secunderabad for all products." },
    { q: "Are you an authorized dealer?", a: "Yes, we are official authorized dealers since 1995 for major brands like LG, Samsung, Voltas, and Daikin." }
  ];
  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          {faqs.map((f, i) => (
            <div key={i} className={styles.faqItem}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
