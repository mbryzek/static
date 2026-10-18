export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	app_dir: "_app",
	app_path: "_app",
	assets: new Set(["favicon.svg","figures/rys-01.png","figures/rys-02.png","figures/rys-03.png","figures/rys-04.png","figures/rys-05.png","figures/rys-06.png","figures/rys-07.png","figures/rys-08.png","figures/rys-09.png","figures/rys-10.png","figures/rys-11.png","figures/rys-12.png","figures/rys-13.png","figures/rys-14.png","figures/rys-15.png","figures/rys-16.png","figures/rys-17.png","figures/rys-18.png","figures/rys-19.png","figures/rys-20.png","figures/rys-21.png","figures/rys-22.png","figures/rys-23.png","figures/rys-24.png","figures/rys-25.png","figures/rys-26.png","figures/rys-27.png","figures/rys-28.png","figures/rys-29.png","figures/rys-30.png","figures/rys-31.png","figures/rys-32.png","figures/rys-33.png","figures/rys-34.png","figures/rys-35.png","figures/rys-36.png","figures/rys-37.png","figures/rys-38.png","figures/rys-39.png","figures/rys-40.png","figures/rys-41.png","figures/rys-42.png","figures/rys-43.png","robots.txt"]),
	mime_types: {".svg":"image/svg+xml",".png":"image/png",".txt":"text/plain",".json":"application/json"},
	client: {start:"_app/immutable/entry/start.CCDtF9s0.js",app:"_app/immutable/entry/app.DPoQwazr.js",imports:["_app/immutable/entry/start.CCDtF9s0.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/CRzLMJPS.js","_app/immutable/chunks/BvtNW8pk.js","_app/immutable/chunks/ClMvIbrQ.js","_app/immutable/chunks/0duoYokK.js","_app/immutable/chunks/PNixQK1x.js","_app/immutable/chunks/CNc9hWdL.js","_app/immutable/entry/app.DPoQwazr.js","_app/immutable/chunks/BalqgFBT.js","_app/immutable/chunks/DoVJxUsg.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
	
	nodes: [
		__memo(() => import('./nodes/0.js')),
		__memo(() => import('./nodes/1.js'))
	],
	remotes: {
		
	},
	routes: [
		
	],
	prerendered_routes: new Set(["/","/__data.json","/changelog","/changelog/__data.json","/glossary","/glossary/__data.json","/pl","/pl/__data.json","/en","/en/__data.json","/pl-en","/pl-en/__data.json","/pl/front","/pl/front/__data.json","/pl/1","/pl/1/__data.json","/pl/2","/pl/2/__data.json","/pl/3","/pl/3/__data.json","/pl/4","/pl/4/__data.json","/pl/5","/pl/5/__data.json","/pl/6","/pl/6/__data.json","/pl/7","/pl/7/__data.json","/pl/8","/pl/8/__data.json","/pl/9","/pl/9/__data.json","/en/front","/en/front/__data.json","/en/1","/en/1/__data.json","/en/2","/en/2/__data.json","/en/3","/en/3/__data.json","/en/4","/en/4/__data.json","/en/5","/en/5/__data.json","/en/6","/en/6/__data.json","/en/7","/en/7/__data.json","/en/8","/en/8/__data.json","/en/9","/en/9/__data.json","/pl-en/front","/pl-en/front/__data.json","/pl-en/1","/pl-en/1/__data.json","/pl-en/2","/pl-en/2/__data.json","/pl-en/3","/pl-en/3/__data.json","/pl-en/4","/pl-en/4/__data.json","/pl-en/5","/pl-en/5/__data.json","/pl-en/6","/pl-en/6/__data.json","/pl-en/7","/pl-en/7/__data.json","/pl-en/8","/pl-en/8/__data.json","/pl-en/9","/pl-en/9/__data.json"]),
	matchers: async () => {
		const { params } = await import('./entries/params.js');
		return params;
	},
	server_assets: {}
}
})();
