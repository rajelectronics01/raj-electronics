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
          <h2 className={styles.sectionTitle}>Bulk Orders &amp; Institutional Supply — We Cater to Businesses, Schools, Hospitals &amp; Housing Societies</h2>
          <p className={styles.bulkText}>
            Raj Electronics is Secunderabad's preferred partner for bulk electronics procurement. Whether you're outfitting a corporate office, school, hospital, hotel, PG accommodation, government institution, or housing society — we offer competitive pricing, flexible delivery, and dedicated after-sales support. Bulk orders accepted. Institutional orders welcome. GST billing available.
          </p>
          <p className={styles.bulkText} style={{ marginTop: '10px' }}>
            We are an authorized wholesale electronics dealer serving Hyderabad and Secunderabad with direct-brand pricing on Split ACs, Smart TVs, Refrigerators, Washing Machines, and Air Coolers. Our bulk AC purchase program is trusted by schools, hospitals, and housing societies across Telangana.
          </p>
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
              <p>&quot;{r.text}&quot;</p>
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
    {
      q: "Do you accept bulk orders for AC in Hyderabad?",
      a: "Yes. Raj Electronics is Secunderabad's main center for bulk AC purchase in Hyderabad. We supply Split ACs, Inverter ACs, and Window ACs to schools, hospitals, corporate offices, and housing societies across Telangana with wholesale pricing and GST billing."
    },
    {
      q: "Are you an authorized AC dealer in Secunderabad?",
      a: "Yes, we are an authorized AC dealer in Secunderabad since 1995. We are official authorized dealers for LG, Samsung, Daikin, Voltas, Blue Star, and other leading brands."
    },
    {
      q: "Where to buy AC in Secunderabad at best price?",
      a: "Visit Raj Electronics at 7-1-949 Rashtrapati Road, Bhoiguda, Secunderabad — the best place to buy an air conditioner in Secunderabad with the lowest price guarantee, free delivery, and installation."
    },
    {
      q: "Which is the best TV showroom in Secunderabad?",
      a: "Raj Electronics on RP Road is the best TV showroom in Secunderabad. We stock the latest Samsung, LG, Sony, and TCL Smart TVs, 4K TVs, and Google TVs at prices better than any online marketplace."
    },
    {
      q: "Do you provide GST invoice for electronics purchases?",
      a: "Yes, we provide valid GST invoices for all institutional and retail purchases to help you claim tax benefits. We are a fully GST-compliant electronics dealer in Hyderabad."
    },
    {
      q: "Do you offer home delivery across Hyderabad?",
      a: "Yes, we offer fast and reliable home delivery across Hyderabad, Secunderabad, Ameerpet, Kukatpally, Madhapur, Miyapur, Koti, Attapur, Kothapet, Himayat Nagar, Alwal, Toli Chowki, and all major areas."
    },
    {
      q: "Who sells Daikin AC in Hyderabad?",
      a: "Raj Electronics is an authorized Daikin AC dealer in Hyderabad and Secunderabad. Visit our showroom on RP Road for the full range of Daikin Split ACs and Inverter ACs with installation support."
    },
    {
      q: "Where to buy LG TV in Secunderabad?",
      a: "Raj Electronics on Rashtrapati Road, Secunderabad is an authorized LG TV dealer. We stock LG Smart TVs, 4K TVs, and OLED TVs at the best prices with manufacturer warranty."
    },
    {
      q: "Do you supply ACs for schools and hospitals?",
      a: "Yes, we are the preferred institutional AC supplier for schools, hospitals, and government buildings in Hyderabad. We offer bulk AC purchase programs with best wholesale pricing, GST billing, and installation support."
    },
    {
      q: "What brands of air coolers do you stock?",
      a: "We stock Symphony, Bajaj, Kenstar, and other leading brands of air coolers in Secunderabad — including desert air coolers, personal air coolers, and tower air coolers — at best prices with delivery."
    },
    {
      q: "Do you have washing machines in Secunderabad?",
      a: "Yes. We are an authorized washing machine dealer in Secunderabad stocking top load, front load, semi-automatic, and fully automatic washing machines from LG, Samsung, Whirlpool, and IFB at best prices."
    },
    {
      q: "What is the best appliance store near RP Road?",
      a: "Raj Electronics at 7-1-949 Rashtrapati Road (RP Road), Bhoiguda, Secunderabad is the best appliance store near RP Road. We have the largest live display of ACs, TVs, Refrigerators, and Washing Machines in the area."
    },
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

// SEO keyword coverage — rendered as a visible "Service Areas" section
export function ServiceAreasSection() {
  const areas = [
    "Secunderabad", "Hyderabad", "RP Road", "Rashtrapati Road", "Bhoiguda",
    "Clock Tower", "Rani Gunj", "MG Road", "Ameerpet", "Koti",
    "Kukatpally", "Madhapur", "Miyapur", "Attapur", "Kothapet",
    "Himayat Nagar", "RTC X Roads", "Alwal", "Toli Chowki"
  ];
  const products = [
    { label: "Split AC", href: "/category/air-conditioners" },
    { label: "Smart TV", href: "/category/televisions" },
    { label: "Refrigerator", href: "/category/refrigerators" },
    { label: "Washing Machine", href: "/category/washing-machines" },
    { label: "Air Cooler", href: "/category/air-coolers" },
    { label: "Water Dispenser", href: "/category/water-dispensers" },
    { label: "Chest Freezer", href: "/category/chest-freezers" },
  ];
  return (
    <section style={{ padding: '48px 0 24px', background: '#0b1120', borderTop: '1px solid #1e293b' }}>
      <div className={styles.container}>
        <h2 style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>
          We Deliver Across Hyderabad &amp; Secunderabad
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
          {areas.map((area) => (
            <span key={area} style={{
              background: '#1e293b', color: '#94a3b8', padding: '5px 14px',
              borderRadius: '999px', fontSize: '0.8rem', border: '1px solid #334155'
            }}>
              {area}
            </span>
          ))}
        </div>
        <h2 style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Shop by Product
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {products.map((p) => (
            <Link key={p.href} href={p.href} style={{
              background: '#1e293b', color: '#60a5fa', padding: '5px 14px',
              borderRadius: '999px', fontSize: '0.8rem', border: '1px solid #2563eb',
              textDecoration: 'none'
            }}>
              {p.label}
            </Link>
          ))}
        </div>
        {/* Hidden keyword coverage for crawlers — all major local-commercial + product-intent + brand terms */}
        <div className="sr-only">
          <p>electronics store in Hyderabad, best electronics store in Secunderabad, electronics shop Secunderabad near me, electronics showroom Secunderabad, electronics dealer Hyderabad, home appliances store Hyderabad, appliance store Secunderabad</p>
          <p>ac dealer Secunderabad, split ac dealer Secunderabad, inverter ac dealer Secunderabad, window ac dealer Secunderabad, 1 ton ac dealer Secunderabad, 1.5 ton ac dealer Secunderabad, 2 ton ac dealer Secunderabad, air conditioner Secunderabad near me, air conditioner Secunderabad best price, air conditioner Secunderabad with installation, air conditioner Secunderabad authorized dealer, air conditioner Secunderabad bulk order</p>
          <p>LG ac dealer in Secunderabad, LG split ac dealer in Secunderabad, LG inverter ac dealer in Secunderabad, Samsung ac dealer in Secunderabad, Daikin ac dealer in Secunderabad, Voltas ac dealer in Secunderabad, Blue Star ac dealer in Secunderabad</p>
          <p>air cooler Secunderabad near me, desert air cooler Secunderabad, personal air cooler Secunderabad, tower air cooler Secunderabad, Symphony air cooler Secunderabad, Bajaj air cooler Secunderabad, air cooler bulk purchase Hyderabad</p>
          <p>smart tv Secunderabad near me, led tv Secunderabad best price, 4k tv Secunderabad, Google tv dealer Secunderabad, Samsung tv dealer Secunderabad, LG tv dealer Secunderabad, television showroom Secunderabad</p>
          <p>refrigerator Secunderabad near me, double door refrigerator Secunderabad, frost free refrigerator Secunderabad, LG refrigerator dealer Secunderabad, Samsung refrigerator dealer Secunderabad</p>
          <p>washing machine Secunderabad near me, top load washing machine Secunderabad, front load washing machine Secunderabad, fully automatic washing machine Secunderabad, LG washing machine dealer Secunderabad, Samsung washing machine dealer Secunderabad</p>
          <p>bulk AC purchase Hyderabad, institutional electronics supplier Secunderabad, corporate appliance procurement Telangana, wholesale electronics dealer Hyderabad, school AC supplier Hyderabad, hospital appliance supplier Hyderabad, gst billing electronics Hyderabad</p>
          <p>ac dealer Ameerpet, ac dealer Kukatpally, ac dealer Madhapur, ac dealer Miyapur, ac dealer Koti, ac dealer Attapur, ac dealer Kothapet, ac dealer Himayat Nagar, ac dealer RTC X Roads, ac dealer Alwal, ac dealer Toli Chowki</p>
          <p>electronics store Ameerpet, electronics store Kukatpally, electronics store Madhapur, electronics store Miyapur, electronics store Koti, best electronics shop near me Hyderabad</p>
        </div>
      </div>
    </section>
  );
}
