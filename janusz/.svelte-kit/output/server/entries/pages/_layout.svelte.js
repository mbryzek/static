import { bt as resolve } from "../../chunks/internal.js";
import { d as escape_html, l as attr, n as derived } from "../../chunks/server2.js";
import "../../chunks/paths.js";
import { t as page } from "../../chunks/state.js";
//#region src/lib/components/Shell.svelte
function Shell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		const commit = derived(() => page.data["source"]?.commit);
		const path = derived(() => page.url.pathname);
		$$renderer.push(`<header class="site-header"><a class="site-title"${attr("href", resolve("/"))}>Janusz Bryzek <span class="year">1978</span></a> <nav class="site-nav" aria-label="Strona · Site"><a${attr("href", resolve("/"))}${attr("aria-current", path() === "/" ? "page" : void 0)}>Spis treści · Contents</a> <a${attr("href", resolve("/glossary"))}${attr("aria-current", path() === "/glossary" ? "page" : void 0)}>Słownik · Glossary</a> <a${attr("href", resolve("/changelog"))}${attr("aria-current", path() === "/changelog" ? "page" : void 0)}>Zmiany · Changelog</a></nav></header> <main>`);
		children($$renderer);
		$$renderer.push(`<!----></main> <footer class="site-footer"><p>Janusz Bryzek, <i>Metoda kompensacji wpływu temperatury w półprzewodnikowych przetwornikach ciśnienia</i>, praca doktorska, Politechnika
    Warszawska, 1978.</p> `);
		if (commit()) $$renderer.push(`<!--[0--><p class="revision">Tekst · Text: ${escape_html(commit().slice(0, 12))}</p>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></footer>`);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	Shell($$renderer, {
		children: ($$renderer) => {
			children($$renderer);
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map