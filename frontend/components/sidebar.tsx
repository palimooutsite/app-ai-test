'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navSections = [
  {
    title: 'Core',
    items: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/accounts', label: 'Accounts' },
      { href: '/journal-entries', label: 'Journal Entries' },
    ],
  },
  {
    title: 'Reports',
    items: [
      { href: '/reports/balance-sheet', label: 'Balance Sheet' },
      { href: '/reports/income-statement', label: 'Income Statement' },
      { href: '/reports/cash-flow', label: 'Cash Flow' },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/integrations', label: 'Integrations' },
      { href: '/settings/users-roles', label: 'Users & Roles' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <p className="brand-badge">Enterprise Suite</p>
        <h2>LedgerOne Cloud</h2>
        <p className="brand-subtitle">Financial operations & compliance workspace</p>
      </div>

      <nav className="nav-sections">
        {navSections.map((section) => (
          <div key={section.title} className="nav-section">
            <p>{section.title}</p>
            <ul>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={isActive ? 'nav-link active' : 'nav-link'}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
