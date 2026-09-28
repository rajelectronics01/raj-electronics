import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, STORE, STORE_ID, faqJsonLd, jsonLdString } from '@/lib/seo';

const PATH = '/blog/which-ton-ac-for-my-room';
const TITLE = '1 Ton vs 1.5 Ton vs 2 Ton AC: Which Size for Your Room in Hyderabad?';
const DESCRIPTION = 'Simple AC size chart by room size for Hyderabad homes. Learn when to pick a 1 ton, 1.5 ton or 2 ton AC, and how sun, top floors and people change the answer.';

export const metadata: Metadata = {
  title: `${TITLE} | Raj Electronics`,
  description: DESCRIPTION,
  keywords: 'which ton ac for my room, 1 ton vs 1.5 ton ac, 1.5 ton vs 2 ton ac, ac size calculator, ac tonnage for room size, best ac size for bedroom, ac for 150 sq ft room, ac for hall Hyderabad, ac buying guide Hyderabad',
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'article', url: PATH, siteName: 'Raj Electronics', locale: 'en_IN' },
};

const SIZE_CHART = [
  { room: 'Up to 120 sq ft (about 10 × 12 ft)', ton: '1 ton', example: 'Small bedroom, study, cabin' },
  { room: '120 – 180 sq ft (about 12 × 15 ft)', ton: '1.5 ton', example: 'Master bedroom, small living room' },
  { room: '180 – 250 sq ft (about 15 × 16 ft)', ton: '2 ton', example: 'Living room, hall, small office' },
  { room: 'Over 250 sq ft', ton: '2 ton + another AC, or a larger unit', example: 'Large hall, shop, open-plan office' },
];

const FAQS = [
  { q: 'Which ton AC is best for a 150 sq ft room?', a: 'A 1.5 ton AC is right for a 150 sq ft room in most Hyderabad homes. If the room is on the top floor or gets strong afternoon sun, 1.5 ton is still the right choice rather than 1 ton.' },
  { q: 'Is a 1 ton AC enough for a bedroom?', a: 'A 1 ton AC is enough for a bedroom of up to about 120 sq ft that does not get direct afternoon sun. Larger or hotter rooms need 1.5 ton.' },
  { q: 'Does a bigger AC use more electricity?', a: 'A bigger AC draws more power when running at full speed, but an undersized AC runs at full speed all the time and still fails to cool. With an inverter AC of the right size, running cost is usually lower than with an undersized one.' },
  { q: 'Should I buy a 3 star or 5 star AC?', a: 'If the AC will run more than 6–8 hours a day through the Hyderabad summer, a 5 star inverter AC usually pays back its higher price through lower electricity bills within a few years. For occasional use, 3 star is fine.' },
];

export default function WhichTonAc() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      mainEntityOfPage: `${SITE_URL}${PATH}`,
      author: { '@type': 'Organization', name: STORE.name, url: SITE_URL },
      publisher: { '@id': STORE_ID },
      datePublished: '2026-09-28',
      dateModified: '2026-09-28',
    },
    faqJsonLd(FAQS),
  ];

  const h2 = { fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '30px 0 15px' } as const;
  const p = { marginBottom: '20px' } as const;
  const cell = { border: '1px solid #e2e8f0', padding: '10px', textAlign: 'left' } as const;

  return (
    <article style={{ lineHeight: '1.8', color: '#334155' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>{TITLE}</h1>

      <p style={p}>
        <strong>Short answer:</strong> a <strong>1 ton AC</strong> suits rooms up to about 120 sq ft, a <strong>1.5 ton AC</strong> suits 120–180 sq ft, and a <strong>2 ton AC</strong> suits 180–250 sq ft. In Hyderabad, go one size up if the room is on the top floor or gets direct afternoon sun.
      </p>

      <h2 style={h2}>AC size chart by room size</h2>
      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={cell}>Room size</th><th style={cell}>AC size</th><th style={cell}>Typical room</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.map((r) => (
              <tr key={r.room}><td style={cell}>{r.room}</td><td style={cell}><strong>{r.ton}</strong></td><td style={cell}>{r.example}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={p}>To find your room size, multiply its length by its width in feet. A 12 ft × 14 ft room is 168 sq ft, so it needs a 1.5 ton AC.</p>

      <h2 style={h2}>When to choose a bigger AC</h2>
      <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
        <li><strong>Top floor:</strong> the roof heats up all day in Hyderabad summers and radiates heat into the room at night.</li>
        <li><strong>West-facing windows or large glass:</strong> afternoon sun adds a lot of heat.</li>
        <li><strong>More than 2–3 people</strong> regularly in the room, or a kitchen opening into it.</li>
        <li><strong>High ceilings</strong> above 10 ft mean more air to cool.</li>
      </ul>

      <h2 style={h2}>Inverter or non-inverter?</h2>
      <p style={p}>
        For Hyderabad, where ACs often run for many hours a day from March to June, an <strong>inverter AC</strong> is almost always the better buy. It slows its compressor down once the room is cool instead of switching on and off, which saves electricity and keeps the temperature steady.
      </p>

      <h2 style={h2}>Frequently asked questions</h2>
      {FAQS.map((f) => (
        <div key={f.q} style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>{f.q}</h3>
          <p style={{ margin: 0 }}>{f.a}</p>
        </div>
      ))}

      <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '30px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px', color: '#1e3a8a' }}>Not sure which size you need?</h3>
        <p style={{ marginBottom: '15px' }}>
          Tell us your room size at our RP Road showroom or call {STORE.phoneDisplay}. We&apos;ll recommend the right AC and arrange delivery and installation. See today&apos;s prices in our <Link href="/blog/ac-price-list-hyderabad">AC price list</Link>.
        </p>
        <Link href="/category/air-conditioners" style={{ display: 'inline-block', background: '#e11d48', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
          Shop Air Conditioners
        </Link>
      </div>
    </article>
  );
}
