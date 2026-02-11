import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AfriNutri",
  description: "Analyse nutritionnelle des plats africains",
  manifest: "/manifest.json",
  themeColor: "#16a34a",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AfriNutri",
  },
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
