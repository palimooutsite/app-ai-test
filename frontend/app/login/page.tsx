'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '').trim();

    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 650));
    router.push('/dashboard');
  };

  return (
    <section className="login-portal">
      <div className="login-hero">
        <p className="hero-chip">Enterprise Accounting Portal</p>
        <h1>LedgerOne Identity Gateway</h1>
        <p>
          Akses seluruh modul keuangan perusahaan dari portal terpisah dengan keamanan enterprise-grade,
          kontrol akses berbasis peran, dan audit trail real-time.
        </p>
        <ul>
          <li>Single secure access untuk seluruh divisi finance.</li>
          <li>Enkripsi sesi dan monitoring aktivitas pengguna.</li>
          <li>Terintegrasi dengan dashboard utama setelah autentikasi.</li>
        </ul>
      </div>

      <div className="login-card">
        <div>
          <p className="login-eyebrow">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p className="login-subtitle">Gunakan kredensial perusahaan untuk masuk ke halaman utama.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Corporate email</label>
          <input id="email" name="email" type="email" placeholder="finance@company.com" autoComplete="email" />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Login to main workspace'}
          </button>
        </form>
      </div>
    </section>
  );
}
