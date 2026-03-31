import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Sidebar } from '../components/sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'SME Accounting Frontend',
  description: 'Frontend shell for the SaaS accounting system',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Sidebar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
