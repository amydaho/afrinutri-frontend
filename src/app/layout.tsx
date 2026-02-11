import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AfriNutri",
  description: "Analyse nutritionnelle des plats africains",
  manifest: "/manifest.json",
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
