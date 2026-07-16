import { Card, PageHeader } from '@/components/ui';
import { MOCK_ACTIVITY, MOCK_STATS } from '@/lib/mockData';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Resumen general de UVA App." />

      <div className="mb-7 grid grid-cols-4 gap-4">
        {MOCK_STATS.map((stat) => (
          <Card key={stat.label}>
            <p className="text-[12px] font-semibold text-ink-secondary">{stat.label}</p>
            <p className="mt-1.5 text-[26px] font-extrabold text-ink">{stat.value}</p>
            <p className={`mt-1 text-[11px] font-semibold ${stat.up ? 'text-success' : 'text-danger'}`}>{stat.trend}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="mb-2.5 text-[14px] font-bold text-ink">Actividad reciente</h2>
        <ul>
          {MOCK_ACTIVITY.map((item) => (
            <li
              key={item.text}
              className="flex justify-between gap-4 border-b border-border py-2.5 text-[13px] text-ink last:border-b-0"
            >
              <span>{item.text}</span>
              <span className="shrink-0 text-ink-secondary">{item.time}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Analytics must not carry free text, symptoms or intimate product names
          when an aggregate is enough (ficha §27). Saying it here keeps whoever
          builds the real dashboard from quietly crossing that line. */}
      <p className="mt-5 text-[11px] leading-4 text-ink-faint">
        Las métricas son agregadas. No incluyen texto libre, síntomas ni nombres de productos íntimos por usuaria.
      </p>
    </>
  );
}
