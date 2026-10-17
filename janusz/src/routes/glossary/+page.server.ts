import { loadEdition } from '#lib/server/content.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ terms: loadEdition().glossary });
