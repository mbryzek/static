import * as server from '../entries/pages/glossary/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/glossary/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/glossary/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.DRf6kPsM.js","_app/immutable/chunks/0duoYokK.js"];
export const stylesheets = [];
export const fonts = [];
