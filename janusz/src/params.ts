import { defineParams } from '@sveltejs/kit/params';
import { SECTIONS, type Section } from '#lib/thesis/chapter.ts';
import { isMode, type Mode } from '#lib/thesis/modes.ts';

export const params = defineParams({
  mode: (param): Mode | undefined => (isMode(param) ? param : undefined),
  section: (param): Section | undefined => ((SECTIONS as readonly string[]).includes(param) ? (param as Section) : undefined)
});
