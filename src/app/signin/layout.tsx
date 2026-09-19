import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Any2PDF",
  description: "Create an account or sign in to Any2PDF with Google or email.",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}