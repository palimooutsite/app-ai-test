import { PageShell } from '../../components/page-shell';

export default function DashboardPage() {
  return (
    <PageShell title="Dashboard" description="At-a-glance business health and accounting activity.">
      <div className="kpi-grid">
        <article className="kpi-card"><strong>Revenue (MTD)</strong><p>$0.00</p></article>
        <article className="kpi-card"><strong>Expenses (MTD)</strong><p>$0.00</p></article>
        <article className="kpi-card"><strong>Cash Balance</strong><p>$0.00</p></article>
      </div>
    </PageShell>
  );
}
