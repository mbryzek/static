import { i as head } from "../../chunks/server2.js";
import "../../chunks/index-server.js";
import { t as Contents } from "../../chunks/Contents.js";
import "../../chunks/modes.js";
import { t as ModeSelector } from "../../chunks/ModeSelector.js";
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let mode = "en";
		head("1uha8ag", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Janusz Bryzek — Metoda kompensacji wpływu temperatury (1978)</title>`);
			});
			$$renderer.push(`<meta name="description" content="Janusz Bryzek's 1978 doctoral thesis on temperature compensation in semiconductor pressure transducers, in Polish and in English translation."/>`);
		});
		$$renderer.push(`<section class="landing"><h1 lang="pl">Metoda kompensacji wpływu temperatury w półprzewodnikowych przetwornikach ciśnienia</h1> <p class="subtitle">A Method of Temperature Compensation in Semiconductor Pressure Transducers</p> <p class="byline">Janusz Bryzek · Politechnika Warszawska · 1978</p> `);
		ModeSelector($$renderer, {
			current: mode,
			section: "front"
		});
		$$renderer.push(`<!----> `);
		Contents($$renderer, {
			toc: data.toc,
			mode
		});
		$$renderer.push(`<!----></section>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map