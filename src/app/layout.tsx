export const metadata = {
  title: "AfriNutri",
  description: "Analyse nutritionnelle des plats africains",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body>{children}</body>
    </html>
  );
}
