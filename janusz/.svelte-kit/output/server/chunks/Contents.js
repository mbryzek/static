import { bt as resolve } from "./internal.js";
import { d as escape_html, l as attr, r as ensure_array_like } from "./server2.js";
import "./paths.js";
//#region src/lib/components/Contents.svelte
function Contents($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { toc, mode } = $$props;
		$$renderer.push(`<ol class="contents"><!--[-->`);
		const each_array = ensure_array_like(toc);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let entry = each_array[$$index];
			$$renderer.push(`<li><a${attr("href", resolve("/[mode=mode]/[section=section]", {
				mode,
				section: entry.section
			}))}>`);
			if (mode === "en") $$renderer.push(`<!--[0-->${escape_html(entry.en)}`);
			else if (mode === "pl") $$renderer.push(`<!--[1--><span lang="pl">${escape_html(entry.pl)}</span>`);
			else $$renderer.push(`<!--[-1--><span lang="pl">${escape_html(entry.pl)}</span> <span class="secondary">${escape_html(entry.en)}</span>`);
			$$renderer.push(`<!--]--></a></li>`);
		}
		$$renderer.push(`<!--]--></ol>`);
	});
}
//#endregion
export { Contents as t };

//# sourceMappingURL=Contents.js.map