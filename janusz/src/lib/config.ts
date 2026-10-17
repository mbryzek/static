// Where the questions page sends its answers: platform's production API, which allows
// https://janusz.bryzek.com as a CORS origin. VITE_API_BASE_URL points a local build elsewhere.

export const apiBaseUrl: string = import.meta.env['VITE_API_BASE_URL'] ?? 'https://api.idempotent.io';
