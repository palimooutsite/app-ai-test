'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';

export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <main className="login-main">{children}</main>;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
