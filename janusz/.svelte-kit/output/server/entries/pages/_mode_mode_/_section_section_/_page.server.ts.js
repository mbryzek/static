import { r as alignPages, t as chapter } from "../../../../chunks/content.js";
import { t as SECTIONS } from "../../../../chunks/sections.js";
import { t as MODES } from "../../../../chunks/modes.js";
//#region src/routes/[mode=mode]/[section=section]/+page.server.ts
var entries = () => MODES.flatMap((mode) => SECTIONS.map((section) => ({
	mode,
	section
})));
var load = ({ params }) => {
	const mode = params.mode;
	const section = params.section;
	const pl = chapter("pl", section);
	const en = chapter("en", section);
	const index = SECTIONS.indexOf(section);
	return {
		mode,
		section,
		pl: mode === "en" ? null : pl,
		en: mode === "pl" ? null : en,
		rows: mode === "pl-en" ? alignPages(pl.pages, en.pages) : [],
		prev: SECTIONS[index - 1] ?? null,
		next: SECTIONS[index + 1] ?? null
	};
};
//#endregion
export { entries, load };

//# sourceMappingURL=_page.server.ts.js.map