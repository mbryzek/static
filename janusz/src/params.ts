import { defineParams } from '@sveltejs/kit/params';
import { isSection, type Section } from '#lib/thesis/sections.ts';
import { isMode, type Mode } from '#lib/thesis/modes.ts';

export const params = defineParams({
  mode: (param): Mode | undefined => (isMode(param) ? param : undefined),
  section: (param): Section | undefined => (isSection(param) ? param : undefined)
});
