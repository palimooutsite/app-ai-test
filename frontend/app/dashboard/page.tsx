import { PageShell } from '../../components/page-shell';

const kpiData = [
  { label: 'Revenue (MTD)', value: '$128,450', change: '+8.2%' },
  { label: 'Expenses (MTD)', value: '$74,210', change: '-2.1%' },
  { label: 'Cash Balance', value: '$342,900', change: '+3.6%' },
  { label: 'Open Invoices', value: '$46,500', change: '12 overdue' },
];

export default function DashboardPage() {
  return (
    <PageShell title="Executive Dashboard" description="Enterprise-grade overview of financial operations, liquidity, and collection performance.">
      <div className="kpi-grid">
        {kpiData.map((item) => (
          <article className="kpi-card" key={item.label}>
            <strong>{item.label}</strong>
            <p>{item.value}</p>
            <span>{item.change}</span>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
