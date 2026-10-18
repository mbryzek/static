import { n as loadEdition } from "../../../chunks/content.js";
//#region src/routes/glossary/+page.server.ts
var load = () => ({ terms: loadEdition().glossary });
//#endregion
export { load };

//# sourceMappingURL=_page.server.ts.js.map