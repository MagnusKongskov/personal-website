import TermsAndPrivacy from "@/components/TermsAndPrivacy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Privacy",
  description: "Terms and privacy policy for Kongzkov",
};

export default function TermsAndPrivacyPage() {
  return <TermsAndPrivacy />;
}
