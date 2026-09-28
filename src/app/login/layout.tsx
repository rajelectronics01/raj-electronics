import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Raj Electronics",
  description: "Login to your Raj Electronics account to track your orders and manage your profile.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
