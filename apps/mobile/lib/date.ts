/**
 * Date helpers for the menstrual calendar.
 * Locale is fixed to Colombia/Spanish for the beta (ficha: mercado inicial
 * Colombia, idioma español, formato de fecha local).
 */

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/** Weekday headers, Monday-first (matches the prototype's "L M M J V S D"). */
export const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export type TodayParts = { year: number; month: number; day: number };

/** month is 0-indexed, matching JS Date. */
export function todayParts(): TodayParts {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
}

export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Index of the first weekday of the month, Monday-first (Mon=0 … Sun=6). */
export function firstWeekdayOffset(year: number, month: number): number {
  const jsDay = new Date(year, month, 1).getDay(); // Sun=0 … Sat=6
  return (jsDay + 6) % 7;
}

/** Grid cells for a month: leading nulls for offset, then day numbers. */
export function monthGrid(year: number, month: number): (number | null)[] {
  const offset = firstWeekdayOffset(year, month);
  const total = daysInMonth(year, month);
  const cells: (number | null)[] = Array.from({ length: offset }, () => null);
  for (let d = 1; d <= total; d++) cells.push(d);
  return cells;
}

/** "16 de julio" */
export function dayLabel(day: number, month: number): string {
  return `${day} de ${MONTHS[month].toLowerCase()}`;
}

/** ISO yyyy-mm-dd, used as the check-in store key. */
export function isoDate(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function todayIso(): string {
  const { year, month, day } = todayParts();
  return isoDate(year, month, day);
}
