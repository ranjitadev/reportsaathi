import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReportSaathi | रिपोर्ट साथी',
  description: 'Understand your lab report in plain language — English & Hindi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}
