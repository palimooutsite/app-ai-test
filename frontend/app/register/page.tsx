'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get('fullName') ?? '').trim();
    const companyName = String(formData.get('companyName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '').trim();
    const confirmPassword = String(formData.get('confirmPassword') ?? '').trim();

    if (!fullName || !companyName || !email || !password || !confirmPassword) {
      setError('Semua field wajib diisi.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          companyName,
          email,
          password
        })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string | string[] } | null;
        const backendMessage = Array.isArray(data?.message) ? data?.message[0] : data?.message;
        throw new Error(backendMessage ?? 'Registrasi gagal. Silakan coba lagi.');
      }

      const data = (await response.json()) as { accessToken?: string };
      if (data.accessToken) {
        window.localStorage.setItem('accessToken', data.accessToken);
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat registrasi.');
      setIsLoading(false);
    }
  };

  return (
    <section className="login-portal register-portal">
      <div className="login-hero">
        <p className="hero-chip">Enterprise Onboarding</p>
        <h1>Buat Workspace Akuntansi Perusahaan Anda</h1>
        <p>
          Daftarkan perusahaan dalam hitungan menit untuk langsung mengakses dashboard enterprise,
          workflow jurnal otomatis, dan laporan keuangan real-time.
        </p>
        <ul>
          <li>Provisioning tenant otomatis ke backend multi-company.</li>
          <li>Akun pertama langsung menjadi owner workspace.</li>
          <li>Token akses diberikan setelah registrasi berhasil.</li>
        </ul>
      </div>

      <div className="login-card register-card">
        <div>
          <p className="login-eyebrow">Create enterprise account</p>
          <h2>Register your company</h2>
          <p className="login-subtitle">Lengkapi data berikut untuk membuat workspace baru.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="fullName">Nama lengkap</label>
          <input id="fullName" name="fullName" type="text" placeholder="Raisa Pratama" autoComplete="name" />

          <label htmlFor="companyName">Nama perusahaan</label>
          <input id="companyName" name="companyName" type="text" placeholder="PT Maju Finansial" autoComplete="organization" />

          <label htmlFor="email">Corporate email</label>
          <input id="email" name="email" type="email" placeholder="owner@company.com" autoComplete="email" />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Minimal 8 karakter" autoComplete="new-password" />

          <label htmlFor="confirmPassword">Konfirmasi password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Ulangi password"
            autoComplete="new-password"
          />

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating workspace...' : 'Daftar dan masuk ke dashboard'}
          </button>
        </form>

        <p className="auth-switch-link">
          Sudah punya akun? <Link href="/login">Masuk di sini</Link>
        </p>
      </div>
    </section>
  );
}
