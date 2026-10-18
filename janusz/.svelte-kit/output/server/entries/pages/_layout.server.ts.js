import { n as loadEdition } from "../../chunks/content.js";
//#region src/routes/+layout.server.ts
var load = () => {
	const { chapters, source } = loadEdition();
	return {
		toc: chapters.pl.map((c, i) => ({
			section: c.section,
			pl: c.titleText,
			en: chapters.en[i]?.titleText ?? ""
		})),
		source: {
			repo: source.repo,
			commit: source.commit
		}
	};
};
//#endregion
export { load };

//# sourceMappingURL=_layout.server.ts.js.map