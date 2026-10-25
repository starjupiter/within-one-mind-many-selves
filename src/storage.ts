import { defaultSettings, type Session, type Settings } from './model';

const SESSIONS = 'within.sessions.v1';
const SETTINGS = 'within.settings.v1';
const CONSENT = 'within.consent.v1';

export function loadSessions(): Session[] {
  try {
    const value = JSON.parse(localStorage.getItem(SESSIONS) || '[]');
    return Array.isArray(value) ? value.filter(isSession) : [];
  } catch { return []; }
}
export function saveSessions(sessions: Session[]) { localStorage.setItem(SESSIONS, JSON.stringify(sessions)); }
export function loadSettings(): Settings {
  try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS) || '{}') }; }
  catch { return defaultSettings; }
}
export function saveSettings(settings: Settings) { localStorage.setItem(SETTINGS, JSON.stringify(settings)); }
export function hasConsent() {
  try { const value = JSON.parse(localStorage.getItem(CONSENT) || 'null'); return value?.version === 1 && value?.agreed === true; }
  catch { return false; }
}
export function saveConsent() { localStorage.setItem(CONSENT, JSON.stringify({ version: 1, agreed: true, at: new Date().toISOString() })); }
export function clearLocalRecords() { [SESSIONS, SETTINGS, CONSENT].forEach(key => localStorage.removeItem(key)); }

export function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  return typeof s.id === 'string' && typeof s.intention === 'string' &&
    typeof s.title === 'string' && typeof s.callSign === 'string' &&
    typeof s.observations === 'string' && typeof s.impressions === 'string' &&
    typeof s.experience === 'string' && typeof s.revisit === 'boolean' &&
    typeof s.startedAt === 'string' && !Number.isNaN(Date.parse(s.startedAt)) &&
    typeof s.completedAt === 'string' && !Number.isNaN(Date.parse(s.completedAt)) &&
    typeof s.elapsedSeconds === 'number' && Number.isFinite(s.elapsedSeconds) &&
    typeof s.plannedSeconds === 'number' && Number.isFinite(s.plannedSeconds) &&
    Array.isArray(s.tags) && s.tags.every(tag => typeof tag === 'string');
}

export function parseImport(text: string): Session[] {
  const parsed: unknown = JSON.parse(text);
  const data = parsed && typeof parsed === 'object' && 'sessions' in parsed
    ? (parsed as { sessions: unknown }).sessions : parsed;
  if (!Array.isArray(data) || !data.every(isSession)) throw new Error('This file does not contain valid WITHIN sessions.');
  return data.map(s => ({ ...s, audioId: undefined }));
}

export function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function exportJSON(sessions: Session[]) {
  download('within-journal.json', new Blob([JSON.stringify({ format: 'WITHIN journal', version: 1, exportedAt: new Date().toISOString(), sessions: sessions.map(s => ({ ...s, audioId: undefined })) }, null, 2)], { type: 'application/json' }));
}
export function exportCSV(sessions: Session[]) {
  const fields: (keyof Session)[] = ['id', 'title', 'callSign', 'intention', 'observations', 'impressions', 'experience', 'revisit', 'tags', 'startedAt', 'completedAt', 'plannedSeconds', 'elapsedSeconds'];
  const quote = (v: unknown) => `"${String(Array.isArray(v) ? v.join('; ') : v ?? '').replaceAll('"', '""')}"`;
  const csv = [fields.join(','), ...sessions.map(s => fields.map(key => quote(s[key])).join(','))].join('\r\n');
  download('within-journal.csv', new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
}
