import { MODES, type Mode } from '#lib/thesis/modes.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => MODES.map((mode) => ({ mode }));

export const load: PageServerLoad = ({ params }) => ({ mode: params.mode as Mode });
