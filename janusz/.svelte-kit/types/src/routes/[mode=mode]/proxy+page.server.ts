// @ts-nocheck
import { MODES, type Mode } from '#lib/thesis/modes.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => MODES.map((mode) => ({ mode }));

export const load = ({ params }: Parameters<PageServerLoad>[0]) => ({ mode: params.mode as Mode });
