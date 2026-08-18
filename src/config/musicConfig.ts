import type { MusicPlayerConfig } from "../types/musicConfig";

// 音乐播放器配置 — Music 页与全站播放器共用
export const musicPlayerConfig: MusicPlayerConfig = {
	showInNavbar: true,
	showInSidebar: false,

	// meting：在线歌单；local：使用下方本地列表
	mode: "meting",

	volume: 0.7,
	playMode: "list",
	showLyrics: true,

	meting: {
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		server: "netease",
		type: "playlist",
		// 默认歌单；可改成你自己的网易云歌单 ID
		id: "10046455237",
		auth: "",
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},

	// mode 改为 "local" 时使用：把 mp3/封面放到 public/assets/music/
	local: {
		playlist: [
			{
				name: "使一颗心免于哀伤",
				artist: "知更鸟 / HOYO-MiX / Chevy",
				url: "/assets/music/使一颗心免于哀伤-哼唱.mp3",
				cover: "/assets/music/cover/109951169585655912.webp",
				lrc: "",
			},
		],
	},
};
