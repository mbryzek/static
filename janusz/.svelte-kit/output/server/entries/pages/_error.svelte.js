import { bt as resolve } from "../../chunks/internal.js";
import { d as escape_html, i as head, l as attr } from "../../chunks/server2.js";
import "../../chunks/paths.js";
import { t as page } from "../../chunks/state.js";
//#region src/routes/+error.svelte
function _error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1j96wlh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(page.status)} — Janusz Bryzek 1978</title>`);
			});
			$$renderer.push(`<meta name="robots" content="noindex"/>`);
		});
		$$renderer.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.status === 404 ? "Nie ma takiej strony. · This page does not exist." : page.error?.message)}</p> <p><a${attr("href", resolve("/"))}>Spis treści · Contents</a></p>`);
	});
}
//#endregion
export { _error as default };

//# sourceMappingURL=_error.svelte.js.map