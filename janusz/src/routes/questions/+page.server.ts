import { loadEdition } from '#lib/server/content.ts';
import { loadQuestions } from '#lib/server/questions.ts';
import type { PageServerLoad } from './$types';

// site_version on every answer is the projects commit the page's text was pulled from, so an
// answer is evaluated against the text the visitor read.
export const load: PageServerLoad = () => ({ questions: loadQuestions(), siteVersion: loadEdition().source.commit });
