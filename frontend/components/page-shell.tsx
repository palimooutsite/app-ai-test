import type { ReactNode } from 'react';

export function PageShell({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <section className="page-shell">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Enterprise Accounting</p>
          <h1>{title}</h1>
          <p className="page-description">{description}</p>
        </div>
        <div className="status-pill">System Healthy</div>
      </header>
      {children ? <div className="page-content">{children}</div> : null}
    </section>
  );
}
