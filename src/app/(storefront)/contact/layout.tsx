import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Open an enquiry with Treadville — general enquiries, sample requests, export enquiries, and partnership conversations welcome.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
