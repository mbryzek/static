import { bt as resolve } from "../../../../chunks/internal.js";
import { d as escape_html, i as head, l as attr, n as derived, o as stringify, r as ensure_array_like, s as html, t as attr_class } from "../../../../chunks/server2.js";
import "../../../../chunks/paths.js";
import { r as noteId } from "../../../../chunks/sections.js";
import { i as htmlLang } from "../../../../chunks/modes.js";
import { t as ModeSelector } from "../../../../chunks/ModeSelector.js";
//#region src/lib/components/Endnotes.svelte
function Endnotes($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { notes, lang } = $$props;
		if (notes.length > 0) {
			$$renderer.push(`<!--[0--><section class="endnotes"${attr("lang", lang)}><h2>${escape_html(lang === "pl" ? "Przypisy tłumacza" : "Translator's notes")}</h2> <ol><!--[-->`);
			const each_array = ensure_array_like(notes);
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let note = each_array[i];
				$$renderer.push(`<li${attr("id", noteId(lang, i + 1))}>${html(note)} <a class="back"${attr("href", `#${stringify(noteId(lang, i + 1))}-ref`)} aria-label="Wróć · Back">↩</a></li>`);
			}
			$$renderer.push(`<!--]--></ol></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/PageLabel.svelte
function PageLabel($$renderer, $$props) {
	let { scan, printed } = $$props;
	if (scan) {
		$$renderer.push(`<!--[0--><a class="page-label"${attr("id", scan)}${attr("href", `#${stringify(scan)}`)}${attr("title", `Skan ${stringify(scan)}`)}>`);
		if (printed) $$renderer.push(`<!--[0-->s. ${escape_html(printed)}`);
		else $$renderer.push(`<!--[-1-->${escape_html(scan)}`);
		$$renderer.push(`<!--]--></a>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]-->`);
}
//#endregion
//#region src/routes/[mode=mode]/[section=section]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const single = derived(() => data.mode === "pl" ? data.pl : data.mode === "en" ? data.en : null);
		const titleText = derived(() => (data.pl ?? data.en)?.titleText ?? "");
		function title(section, mode) {
			const entry = data.toc.find((t) => t.section === section);
			if (!entry) return "";
			return mode === "en" ? entry.en : entry.pl;
		}
		head("ga689k", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(titleText())} — Janusz Bryzek 1978</title>`);
			});
		});
		ModeSelector($$renderer, {
			current: data.mode,
			section: data.section
		});
		$$renderer.push(`<!----> <article${attr_class("chapter", void 0, { "side-by-side": data.mode === "pl-en" })}${attr("lang", htmlLang(data.mode))}>`);
		if (single()) {
			$$renderer.push(`<!--[0--><h1>${html(single().title)}</h1> <!--[-->`);
			const each_array = ensure_array_like(single().pages);
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				let page = each_array[i];
				$$renderer.push(`<div class="page">`);
				PageLabel($$renderer, {
					scan: page.scan,
					printed: page.printed
				});
				$$renderer.push(`<!----> ${html(page.html)}</div>`);
			}
			$$renderer.push(`<!--]--> `);
			Endnotes($$renderer, {
				notes: single().notes,
				lang: single().lang
			});
			$$renderer.push(`<!---->`);
		} else if (data.pl && data.en) {
			$$renderer.push(`<!--[1--><div class="row titles"><h1 lang="pl">${html(data.pl.title)}</h1> <h1 lang="en" class="secondary-title">${html(data.en.title)}</h1></div> <!--[-->`);
			const each_array_1 = ensure_array_like(data.rows);
			for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
				let row = each_array_1[i];
				$$renderer.push(`<div class="row">`);
				PageLabel($$renderer, {
					scan: row.scan,
					printed: row.printed
				});
				$$renderer.push(`<!----> <div class="cell" lang="pl">`);
				if (row.pl) $$renderer.push(`<!--[0-->${html(row.pl.html)}`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div> <div class="cell" lang="en">`);
				if (row.en) $$renderer.push(`<!--[0-->${html(row.en.html)}`);
				else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div></div>`);
			}
			$$renderer.push(`<!--]--> <div class="row"><div class="cell">`);
			Endnotes($$renderer, {
				notes: data.pl.notes,
				lang: "pl"
			});
			$$renderer.push(`<!----></div> <div class="cell">`);
			Endnotes($$renderer, {
				notes: data.en.notes,
				lang: "en"
			});
			$$renderer.push(`<!----></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></article> <nav class="chapter-nav" aria-label="Rozdziały · Chapters">`);
		if (data.prev) $$renderer.push(`<!--[0--><a rel="prev"${attr("href", resolve("/[mode=mode]/[section=section]", {
			mode: data.mode,
			section: data.prev
		}))}>← ${escape_html(title(data.prev, data.mode))}</a>`);
		else $$renderer.push(`<!--[-1--><span></span>`);
		$$renderer.push(`<!--]--> `);
		if (data.next) $$renderer.push(`<!--[0--><a rel="next"${attr("href", resolve("/[mode=mode]/[section=section]", {
			mode: data.mode,
			section: data.next
		}))}>${escape_html(title(data.next, data.mode))} →</a>`);
		else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></nav>`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map