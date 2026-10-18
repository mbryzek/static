import { d as escape_html, i as head, r as ensure_array_like } from "../../../chunks/server2.js";
//#region src/routes/glossary/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("19vapmx", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Słownik · Glossary — Janusz Bryzek 1978</title>`);
			});
		});
		$$renderer.push(`<h1>Słownik · Glossary</h1> <table class="glossary"><thead><tr><th scope="col">Polski</th><th scope="col">English</th><th scope="col">Uwagi · Notes</th></tr></thead><tbody><!--[-->`);
		const each_array = ensure_array_like(data.terms);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let term = each_array[$$index];
			$$renderer.push(`<tr><td lang="pl">${escape_html(term.polish)}</td><td lang="en">${escape_html(term.english)}</td><td lang="en">${escape_html(term.notes)}</td></tr>`);
		}
		$$renderer.push(`<!--]--></tbody></table>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map