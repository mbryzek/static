import { bt as resolve } from "./internal.js";
import { d as escape_html, l as attr, r as ensure_array_like } from "./server2.js";
import "./paths.js";
import { n as MODE_LABELS, t as MODES } from "./modes.js";
//#region src/lib/components/ModeSelector.svelte
function ModeSelector($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { current, section } = $$props;
		$$renderer.push(`<nav class="modes" aria-label="Język · Language"><!--[-->`);
		const each_array = ensure_array_like(MODES);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let mode = each_array[$$index];
			$$renderer.push(`<a${attr("href", section === null ? resolve("/[mode=mode]", { mode }) : resolve("/[mode=mode]/[section=section]", {
				mode,
				section
			}))}${attr("aria-current", mode === current ? "page" : void 0)}>${escape_html(MODE_LABELS[mode])}</a>`);
		}
		$$renderer.push(`<!--]--></nav>`);
	});
}
//#endregion
export { ModeSelector as t };

//# sourceMappingURL=ModeSelector.js.map