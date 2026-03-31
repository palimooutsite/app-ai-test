import type { ReactNode } from 'react';

export function PageShell({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <section className="page-shell">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </section>
  );
}
