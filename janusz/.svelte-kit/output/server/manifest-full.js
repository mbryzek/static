export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	app_dir: "_app",
	app_path: "_app",
	assets: new Set(["favicon.svg","figures/rys-01.png","figures/rys-02.png","figures/rys-03.png","figures/rys-04.png","figures/rys-05.png","figures/rys-06.png","figures/rys-07.png","figures/rys-08.png","figures/rys-09.png","figures/rys-10.png","figures/rys-11.png","figures/rys-12.png","figures/rys-13.png","figures/rys-14.png","figures/rys-15.png","figures/rys-16.png","figures/rys-17.png","figures/rys-18.png","figures/rys-19.png","figures/rys-20.png","figures/rys-21.png","figures/rys-22.png","figures/rys-23.png","figures/rys-24.png","figures/rys-25.png","figures/rys-26.png","figures/rys-27.png","figures/rys-28.png","figures/rys-29.png","figures/rys-30.png","figures/rys-31.png","figures/rys-32.png","figures/rys-33.png","figures/rys-34.png","figures/rys-35.png","figures/rys-36.png","figures/rys-37.png","figures/rys-38.png","figures/rys-39.png","figures/rys-40.png","figures/rys-41.png","figures/rys-42.png","figures/rys-43.png","robots.txt"]),
	mime_types: {".svg":"image/svg+xml",".png":"image/png",".txt":"text/plain"},
	client: {start:"_app/immutable/entry/start.CCDtF9s0.js",app:"_app/immutable/entry/app.DPoQwazr.js",imports:["_app/immutable/entry/start.CCDtF9s0.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/CRzLMJPS.js","_app/immutable/chunks/BvtNW8pk.js","_app/immutable/chunks/ClMvIbrQ.js","_app/immutable/chunks/0duoYokK.js","_app/immutable/chunks/PNixQK1x.js","_app/immutable/chunks/CNc9hWdL.js","_app/immutable/entry/app.DPoQwazr.js","_app/immutable/chunks/BalqgFBT.js","_app/immutable/chunks/DoVJxUsg.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
	
	nodes: [
		__memo(() => import('./nodes/0.js')),
		__memo(() => import('./nodes/1.js')),
		__memo(() => import('./nodes/2.js')),
		__memo(() => import('./nodes/3.js')),
		__memo(() => import('./nodes/4.js')),
		__memo(() => import('./nodes/5.js')),
		__memo(() => import('./nodes/6.js'))
	],
	remotes: {
		
	},
	routes: [
		{
			id: "/",
			pattern: /^\/$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 2 },
			endpoint: null
		},
		{
			id: "/changelog",
			pattern: /^\/changelog\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 5 },
			endpoint: null
		},
		{
			id: "/glossary",
			pattern: /^\/glossary\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 6 },
			endpoint: null
		},
		{
			id: "/[mode=mode]",
			pattern: /^\/([^/]+?)\/?$/,
			params: [{"name":"mode","matcher":"mode","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 3 },
			endpoint: null
		},
		{
			id: "/[mode=mode]/[section=section]",
			pattern: /^\/([^/]+?)\/([^/]+?)\/?$/,
			params: [{"name":"mode","matcher":"mode","optional":false,"rest":false,"chained":false},{"name":"section","matcher":"section","optional":false,"rest":false,"chained":false}],
			page: { layouts: [0,], errors: [1,], leaf: 4 },
			endpoint: null
		}
	],
	prerendered_routes: new Set([]),
	matchers: async () => {
		const { params } = await import('./entries/params.js');
		return params;
	},
	server_assets: {}
}
})();
