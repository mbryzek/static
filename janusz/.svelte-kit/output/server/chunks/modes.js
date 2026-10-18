//#region src/lib/thesis/modes.ts
var MODES = [
	"pl",
	"en",
	"pl-en"
];
var MODE_LABELS = {
	pl: "Polski",
	en: "English",
	"pl-en": "Obok siebie · Side by side"
};
function isMode(value) {
	return MODES.includes(value);
}
var MODE_STORAGE_KEY = "thesis-mode";
function htmlLang(mode) {
	return mode === "en" ? "en" : "pl";
}
//#endregion
export { isMode as a, htmlLang as i, MODE_LABELS as n, MODE_STORAGE_KEY as r, MODES as t };

//# sourceMappingURL=modes.js.map