//#region src/lib/thesis/sections.ts
var SECTIONS = [
	"front",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9"
];
function isSection(value) {
	return SECTIONS.includes(value);
}
function noteId(lang, n) {
	return `tn-${lang}-${n}`;
}
//#endregion
export { isSection as n, noteId as r, SECTIONS as t };

//# sourceMappingURL=sections.js.map