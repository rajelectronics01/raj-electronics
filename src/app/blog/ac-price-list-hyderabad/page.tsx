import { Metadata } from 'next';
import Link from 'next/link';
import { getProductsByCategory } from '@/lib/products';
import { SITE_URL, STORE, STORE_ID, formatINR, plainText, faqJsonLd, jsonLdString } from '@/lib/seo';
import type { Product } from '@/types';

// Built from live stock, so prices on this page always match the store.
export const revalidate = 3600;

const PATH = '/blog/ac-price-list-hyderabad';
const YEAR = new Date().getFullYear();

async function loadAcs(): Promise<Product[]> {
  try {
    return (await getProductsByCategory('air-conditioners')).filter((p) => p.price > 0).sort((a, b) => a.price - b.price);
  } catch (err) {
    console.error('ac-price-list: could not load products:', err);
    return [];
  }
}

const tonOf = (name: string) => name.match(/(\d(?:\.\d)?)\s*ton/i)?.[1];
const starOf = (name: string) => name.match(/(\d)\s*star/i)?.[1];

export async function generateMetadata(): Promise<Metadata> {
  const acs = await loadAcs();
  const from = acs.length ? ` from ${formatINR(acs[0].price)}` : '';
  const title = `AC Price List in Hyderabad ${YEAR} – Split & Inverter AC Prices${from} | Raj Electronics`;
  const description = `Latest AC prices in Hyderabad & Secunderabad: ${acs.length || ''} split and inverter ACs${from} from ${[...new Set(acs.map((a) => a.brand))].slice(0, 5).join(', ') || 'top brands'}. Updated from live stock at Raj Electronics, RP Road. Call ${STORE.phoneDisplay}.`;
  return {
    title,
    description,
    keywords: `ac price list Hyderabad, ac price in Hyderabad ${YEAR}, split ac price Hyderabad, inverter ac price Hyderabad, 1.5 ton ac price Hyderabad, 1.5 ton 5 star inverter ac price, 2 ton ac price Hyderabad, ac price Secunderabad, lowest ac price Hyderabad, ac offers Hyderabad`,
    alternates: { canonical: PATH },
    openGraph: { title, description, type: 'article', url: PATH, siteName: 'Raj Electronics', locale: 'en_IN' },
  };
}

export default async function AcPriceList() {
  const acs = await loadAcs();
  const updated = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

  const faqs = acs.length ? [
    { q: `What is the lowest AC price at Raj Electronics in ${YEAR}?`, a: `Our lowest priced AC right now is the ${plainText(acs[0].name, 120)} at ${formatINR(acs[0].price)}.` },
    ...(() => {
      const oneFive = acs.filter((a) => tonOf(a.name) === '1.5');
      return oneFive.length ? [{ q: 'What is the price of a 1.5 ton AC in Hyderabad?', a: `At Raj Electronics, 1.5 ton ACs currently range from ${formatINR(oneFive[0].price)} to ${formatINR(oneFive[oneFive.length - 1].price)} across ${oneFive.length} models.` }] : [];
    })(),
    { q: 'Does the AC price include installation?', a: `Call ${STORE.phoneDisplay} or visit our RP Road showroom for the installation cost for your AC and site. We deliver and install across Hyderabad and Secunderabad.` },
  ] : [];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `AC Price List in Hyderabad ${YEAR}`,
      url: `${SITE_URL}${PATH}`,
      mainEntityOfPage: `${SITE_URL}${PATH}`,
      author: { '@type': 'Organization', name: STORE.name, url: SITE_URL },
      publisher: { '@id': STORE_ID },
      datePublished: '2026-09-28',
      dateModified: new Date().toISOString(),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: acs.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/product/${a.slug}`, name: plainText(a.name, 150) })),
    },
    ...(faqs.length ? [faqJsonLd(faqs)] : []),
  ];

  const cell = { border: '1px solid #e2e8f0', padding: '10px', textAlign: 'left', verticalAlign: 'top' } as const;

  return (
    <article style={{ lineHeight: '1.8', color: '#334155' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>AC Price List in Hyderabad {YEAR}</h1>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>Updated {updated} from live stock at Raj Electronics, RP Road, Secunderabad.</p>

      <p style={{ marginBottom: '20px' }}>
        Below are the current prices of every split and inverter AC we stock, from lowest to highest. Prices change often with brand offers, so call {STORE.phoneDisplay} for today&apos;s best deal. Not sure what size you need? Read <Link href="/blog/which-ton-ac-for-my-room">which ton AC is right for your room</Link>.
      </p>

      {acs.length === 0 ? (
        <p>Prices are being updated. Please call {STORE.phoneDisplay} or <Link href="/category/air-conditioners">browse our ACs</Link>.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={cell}>AC model</th><th style={cell}>Brand</th><th style={cell}>Ton</th><th style={cell}>Star</th><th style={cell}>Price</th>
              </tr>
            </thead>
            <tbody>
              {acs.map((a) => (
                <tr key={a.id}>
                  <td style={cell}><Link href={`/product/${a.slug}`}>{plainText(a.name, 120)}</Link></td>
                  <td style={cell}>{a.brand}</td>
                  <td style={cell}>{tonOf(a.name) ?? '—'}</td>
                  <td style={cell}>{starOf(a.name) ?? '—'}</td>
                  <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                    <strong>{formatINR(a.price)}</strong>
                    {a.originalPrice && a.originalPrice > a.price && (
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>{formatINR(a.originalPrice)}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {faqs.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '30px 0 15px' }}>Frequently asked questions</h2>
          {faqs.map((f) => (
            <div key={f.q} style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{f.q}</h3>
              <p style={{ margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </>
      )}

      <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '30px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px', color: '#1e3a8a' }}>Buying for an office, school or hospital?</h3>
        <p style={{ marginBottom: '15px' }}>We offer bulk AC pricing with GST billing across Telangana.</p>
        <Link href="/bulk-orders" style={{ display: 'inline-block', background: '#e11d48', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
          Get a bulk quote
        </Link>
      </div>
    </article>
  );
}
