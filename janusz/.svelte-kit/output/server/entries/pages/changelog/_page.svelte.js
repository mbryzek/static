import { d as escape_html, i as head, l as attr, r as ensure_array_like } from "../../../chunks/server2.js";
//#endregion
//#region src/lib/data/changelog.ts
var changelog = [...[]].sort((a, b) => b.date.localeCompare(a.date));
//#endregion
//#region src/routes/changelog/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("c3nf25", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Zmiany · Changelog — Janusz Bryzek 1978</title>`);
			});
		});
		$$renderer.push(`<h1>Zmiany · Changelog</h1> `);
		if (changelog.length === 0) $$renderer.push(`<!--[0--><p class="empty">Brak zmian od publikacji. · No corrections yet since publication.</p>`);
		else {
			$$renderer.push(`<!--[-1--><ol class="changelog"><!--[-->`);
			const each_array = ensure_array_like(changelog);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let entry = each_array[$$index];
				$$renderer.push(`<li><time${attr("datetime", entry.date)}>${escape_html(entry.date)}</time> <p>${escape_html(entry.summary)}</p> `);
				if (entry.contributors.length > 0) $$renderer.push(`<!--[0--><p class="credit">Dziękujemy · Thanks to ${escape_html(entry.contributors.join(", "))}</p>`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></li>`);
			}
			$$renderer.push(`<!--]--></ol>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map