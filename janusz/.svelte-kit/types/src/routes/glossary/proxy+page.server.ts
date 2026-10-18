// @ts-nocheck
import { loadEdition } from '#lib/server/content.ts';
import type { PageServerLoad } from './$types';

export const load = () => ({ terms: loadEdition().glossary });
;null as any as PageServerLoad;