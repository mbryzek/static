import { i as head } from "../../../chunks/server2.js";
import { t as Contents } from "../../../chunks/Contents.js";
import { t as ModeSelector } from "../../../chunks/ModeSelector.js";
//#region src/routes/[mode=mode]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("g3nygm", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Spis treści · Contents — Janusz Bryzek 1978</title>`);
			});
		});
		ModeSelector($$renderer, {
			current: data.mode,
			section: null
		});
		$$renderer.push(`<!----> `);
		Contents($$renderer, {
			toc: data.toc,
			mode: data.mode
		});
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map