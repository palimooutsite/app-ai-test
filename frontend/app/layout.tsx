import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppFrame } from '../components/app-frame';
import './globals.css';

export const metadata: Metadata = {
  title: 'SME Accounting Frontend',
  description: 'Frontend shell for the SaaS accounting system',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
