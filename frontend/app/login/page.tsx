import { PageShell } from '../../components/page-shell';

export default function LoginPage() {
  return (
    <PageShell title="Login" description="Authenticate with your company credentials to access protected accounting modules.">
      <p>Next step: connect this form to POST /api/v1/auth/login.</p>
    </PageShell>
  );
}
