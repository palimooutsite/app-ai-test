import Link from 'next/link';

const navItems = [
  { href: '/login', label: 'Login' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/accounts', label: 'Accounts' },
  { href: '/journal-entries', label: 'Journal Entries' },
  { href: '/reports/balance-sheet', label: 'Balance Sheet' },
  { href: '/reports/income-statement', label: 'Income Statement' },
  { href: '/reports/cash-flow', label: 'Cash Flow' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/settings/users-roles', label: 'Users & Roles' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Accounting App</h2>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
