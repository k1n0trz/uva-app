'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Admin shell — desktop-first (brief §25), same UVA identity as the app.
 *
 * Modules follow ficha §22.2. Ones not built yet are absent rather than
 * fake-linked: a dead nav item is worse than an honest gap.
 */
const NAV = [
  { href: '/', label: 'Dashboard' },
  { href: '/usuarios', label: 'Usuarios' },
  { href: '/promociones', label: 'Promociones' },
  { href: '/anuncios', label: 'Anuncios' },
  { href: '/rutinas', label: 'Rutinas' },
  { href: '/configuracion', label: 'Configuración' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen max-w-[1240px] gap-0 px-4 py-6">
      <div className="flex w-full overflow-hidden rounded-3xl border border-border bg-white shadow-[0_12px_40px_rgba(40,35,38,0.08)]">
        <nav
          className="flex w-[220px] shrink-0 flex-col gap-0.5 border-r border-border bg-primary-xsoft py-6"
          aria-label="Módulos"
        >
          <div className="flex items-center gap-2 px-5 pb-5">
            {/* Wordmark only — the real logo file lives in the app's assets. */}
            <span className="text-[15px] font-extrabold text-primary">UVA App</span>
            <span className="text-[11px] font-bold text-primary-dark">Admin</span>
          </div>

          {NAV.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'border-l-[3px] px-5 py-2.5 text-[13px] font-semibold transition-colors',
                  active
                    ? 'border-primary bg-primary-soft text-primary-dark'
                    : 'border-transparent text-ink-secondary hover:bg-primary-soft/40',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="mt-auto px-5 pt-6">
            <p className="text-[10px] leading-4 text-ink-faint">
              Datos simulados. Sin backend real: nada de lo que hagas aquí sale de esta pantalla.
            </p>
          </div>
        </nav>

        <main className="min-w-0 flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
