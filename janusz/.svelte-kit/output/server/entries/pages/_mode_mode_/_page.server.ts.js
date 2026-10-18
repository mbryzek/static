import { t as MODES } from "../../../chunks/modes.js";
//#region src/routes/[mode=mode]/+page.server.ts
var entries = () => MODES.map((mode) => ({ mode }));
var load = ({ params }) => ({ mode: params.mode });
//#endregion
export { entries, load };

//# sourceMappingURL=_page.server.ts.js.map