import { n as isSection } from "../chunks/sections.js";
import { a as isMode } from "../chunks/modes.js";
import { defineParams } from "@sveltejs/kit/params";
//#region src/params.ts
var params = defineParams({
	mode: (param) => isMode(param) ? param : void 0,
	section: (param) => isSection(param) ? param : void 0
});
//#endregion
export { params };

//# sourceMappingURL=params.js.map