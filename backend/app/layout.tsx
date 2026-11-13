import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ReportSaathi API',
  description: 'ReportSaathi backend API service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
