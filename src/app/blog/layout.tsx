import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Raj Electronics Blog | Expert Advice on Electronics in Secunderabad",
  description: "Expert advice, buying guides, and electronics tips from Raj Electronics, Secunderabad. We cover AC buying, bulk orders, authorized dealers, and more.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', background: 'white' }}>
      {children}
    </div>
  );
}
