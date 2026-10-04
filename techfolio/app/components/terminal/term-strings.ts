"use client";

import type { Locale } from "../../lib/i18n";

/**
 * Terminal CLI copy, localized. Commands, ASCII art and technical tokens
 * stay language-neutral; only the human-facing prose is translated.
 */

export type TermStep = { label: string; text: string; cmd: string; takeaway: string };

type TermStrings = {
	// journey
	journey: TermStep[];
	// left nav rail
	navTitle: string;
	navSubtitle: string;
	navNotStarted: string;
	// capability bars: [name, level(0-10), detail]
	skills: [string, number, string][];
	skillsHeader: string;
	skillsFooterA: string;
	skillsFooterB: string;
	// at-a-glance
	stats: [string, string][];
	statsHeader: string;
	// manual pages: [command, description, run]
	manual: [string, string, string][];
	manualHeader: string;
	manualEgg: string;
	// boot
	bootLog: string[];
	bootTitle: string;
	// neofetch
	neofetchInfo: [string, string][];
	// git log
	gitLog: string[];
	gitStatus: string[];
	// hack
	hackLines: string[];
	hackNote: { a: string; intro: string; art: string; end: string };
	// gallery
	gallery: [string, string][];
	galleryHeader: string;
	dragonCaption: string;
	rocketCaption: string;
	// fortunes
	fortunes: string[];
	// inline / ad-hoc
	welcomeLine1: string;
	welcomeLine2a: string;
	welcomeLine2b: string;
	pressEnterToContinue: string;
	orTypeACommand: string;
	inputPlaceholder: string;
	guidedTour: string;
	advancing: string;
	restarting: string;
	// whoami / about
	aboutRole: string;
	aboutBody: string;
	aboutFacts1: string;
	aboutFacts2: string;
	aboutRuleA: string;
	aboutRuleB: string;
	aboutStack: string;
	// intro
	introSub: string;
	introRows: { exp: string; delivered: string; stack: string; rule: string };
	introRuleA: string;
	introRuleB: string;
	// summary footer
	summaryCta1: string;
	summaryCta2: string;
	summaryCta3: string;
	// contact
	emailLabel: string;
	// theme
	themeSet: (next: string) => string;
	// matrix
	matrixWake: string;
	// hack note alt
	hackNotePublic: string;
	// git usage
	gitUsage: string;
	gitStatusClean: (branch: string) => string;
	gitStatusNothing: string;
	gitStatusShip: string;
	// ping
	pingStats: (host: string) => string;
	pingLost: string;
	// fortune/etc
	// python
	pythonLine1: string;
	pythonLine2: string;
	// sudo
	sudoSandwich: string;
	sudoDenied: string;
	// rm
	rmReply: string;
	// exit
	exitLine1: string;
	exitLine2: string;
	// editor
	editorReply: (cmd: string) => string;
	// hello
	helloLine1: string;
	helloLine2: string;
	// xyzzy
	xyzzyReply: string;
	// 42
	fortyTwoReply: string;
	// command not found
	cmdNotFound: (cmd: string) => string;
	didYouMean: string;
	tryHelp: string;
	// cat
	catNoFile: (arg: string) => string;
	catUsage: string;
	// man no entry
	manNoEntry: (arg: string) => string;
	// advance finished
	tourDoneA: string;
	tourDoneB: string;
	tourDoneC: string;
	tourDoneD: string;
	// ghost advance label separator (the "└─" prefix is art, keep)
	// easter egg
	eggPrefix: (n: number, total: number, label: string) => string;
	konamiLine: string;
	// skills deep
	skillsDeepA: string;
	skillsDeepB: string;
	// ping header
	pingHeader: (host: string) => string;
	// uptime
	uptimeLine1: string;
	uptimeLine2: string;
	// uname
	unameLine: string;
	// top header
	topHeader: string;
	// history (no prose)
	// pwd / date / echo (no prose)
	// theme prompt
	// banner (art)
	// art header used in help
	// neofetch done
	// gallery click hint
};

function build(locale: Locale): TermStrings {
	if (locale === "zh-Hans") {
		return {
			journey: [
				{
					label: "01 · 身份",
					text: "先问问系统：这个人是谁？",
					cmd: "whoami",
					takeaway: "Jason Chen —— 电子工程师，4 年+，广州。",
				},
				{
					label: "02 · 能力",
					text: "接着：他到底会做什么？",
					cmd: "skills",
					takeaway: "嵌入式 · 控制 · 定位 · 视觉 · 软件",
				},
				{
					label: "03 · 机器",
					text: "以及背后的这台机器 ——",
					cmd: "neofetch",
					takeaway: "9 个已交付产品 · 2 家公司 · 4 年+ 在线",
				},
				{
					label: "04 · 履历",
					text: "四年，一次一次提交。",
					cmd: "git log",
					takeaway: "AGV → RTK → 实训 → VXS-100 → 教育机器人",
				},
				{
					label: "05 · 表演",
					text: "好的演示总得有点戏剧效果…",
					cmd: "hack",
					takeaway: "（那是假的 —— 真正的重点在后面）",
				},
				{
					label: "06 · 重点",
					text: "去掉噪音，你真正要认识的是：",
					cmd: "intro",
					takeaway: "Jason Chen —— 4 年+，9 个产品，2 家公司，一条准则。",
				},
			],
			navTitle: "旅程",
			navSubtitle: "按回车逐步浏览",
			navNotStarted: "Jason 是谁？",
			skills: [
				["嵌入式", 9, "C/C++ · STM32 · PCB 交付 · 传感集成"],
				["控制", 9, "PID 整定 · 运动控制 · 循迹与 AGV"],
				["定位", 8, "北斗 RTK · GNSS · LPWAN 现场部署"],
				["视觉", 8, "OpenCV · Jetson 边缘 AI · 检测管线"],
				["软件", 8, "Python · TypeScript · Next.js · 小程序"],
			],
			skillsHeader: "能力 —— 在金属车间地板上校准过的",
			skillsFooterA: "上面每一格背后都有",
			skillsFooterB: "已交付硬件",
			stats: [
				["经验", "4 年+，电子 / 嵌入式"],
				["交付", "9 个产品，2 家公司"],
				["专注", "落在金属车间地板上的硬件"],
				["技术栈", "C/C++ · STM32 · PCB · RTK/GNSS · Jetson · Web"],
				["准则", "在台架上跑不通，就绝不交付"],
			],
			statsHeader: "一图速览",
			manual: [
				["next / skip", "把引导之旅推进一章", "next"],
				["restart", "从头重新运行引导", "restart"],
				["intro / me", "收尾 —— 一句话说清我是谁", "intro"],
				["summary / stats", "一图速览 —— 关键亮点", "summary"],
				["skills", "能力条，实打实的那种", "skills"],
				["about / whoami", "Jason 是谁", "about"],
				["contact / social", "邮箱 + 社交主页", "contact"],
				["neofetch", "系统信息，作品集版", "neofetch"],
				["git log", "一段职业生涯的提交历史", "git log"],
				["hack", "好莱坞式入侵（当然是假的）", "hack"],
				["art", "ASCII 画廊 —— 佛像、冯·诺依曼等", "art"],
				["matrix", "follow the white rabbit", "matrix"],
				["theme", "切换绿 / 琥珀荧光", "theme"],
				["cat <file>", "about.txt · skills.txt · contact.txt", "cat about.txt"],
				["ping <host>", "看看网络还能不能用", "ping"],
				["fortune", "鸡汤分发器", "fortune"],
				["history", "你的命令历史", "history"],
				["man <cmd>", "手册页", "man tour"],
				["help", "列出命令", "help"],
				["clear", "清屏", "clear"],
			],
			manualHeader: "可用命令 —— 点任意一个即可：",
			manualEgg: "真正的黑客不看手册。",
			bootLog: [
				"[    0.000000] JasonOS 2.6.10 正在 portfolio-cpu0 上启动",
				"[    0.000421] CPU: 好奇心 @ 5.15GHz (8 核，1 个大脑)",
				"[    0.001024] 内存: 128TB 想法空间可用",
				"[    0.002048] solder0: 检测到 USB 烙铁，加热至 350°C",
				"[    0.003145] rtk-gnss0: 31 颗卫星锁定，解算：RTK-FIXED",
				"[    0.004096] pid0: Kp=1.8 Ki=0.4 Kd=0.06 —— 环路稳定",
				"[    0.005512] agv-can0: 链路已连接，500 kbit/s，金属地板就绪",
				"[    0.006331] jetson0: CUDA 核心唤醒，边缘 AI 管线待命",
				"[    0.007222] coffee0: 咖啡依赖已解决（关键）",
				"[    0.008192] 挂载 /dev/projects 到 /home/jason ... 完成",
				"[  OK  ] 已启动 Portfolio Shell。",
				"[  OK  ] 已到达目标 已交付产品 (9)。",
				"[  OK  ] 已到达目标 公司 (2)。",
				"[  OK  ] 已启动彩蛋守护进程 (4 个彩蛋隐藏)。",
				"",
			],
			bootTitle: "JasonOS 2.6.10 —— portfolio shell",
			neofetchInfo: [
				["OS", "JasonOS 2.6.10 portfolio x86_64"],
				["Host", "中国广州"],
				["Role", "电子工程师"],
				["Kernel", "curiosity-5.15-rc2"],
				["Uptime", "4 年+ 做硬件"],
				["Packages", "9 个已交付项目"],
				["Shell", "jsh 1.0（就这玩意儿）"],
				["Editor", "能跑就行"],
			],
			gitLog: [
				"* 9f3e2a1 (HEAD -> main) feat: 重工业 AGV 遥控，金属地板验证",
				"* 4c7b8d2 feat: 北斗 RTK 批量交付 —— 农机保持在线",
				"* a1e5f90 fix: 实训车高 Kp 下的 PID 振荡",
				"* 77d0c3e feat: VXS-100 工业遥控 —— 面板到 PCB",
				"* 52b9aa4 feat: 高校 IoT 实验室教育机器人编队",
				"* 2e08f17 chore: coffee.iv 滴滤 —— 以上所有事的依赖",
			],
			gitStatus: [
				"  位于分支 main",
				"  无内容可提交，工作区干净",
				"  （交付就是默认状态）",
			],
			hackLines: [
				"[ 0.000021] jsh: 入侵模块已加载",
				"[ 0.000112] 正在扫描 portfolio.local 的 65535 个端口 ...",
				"[ 0.000987]    22/tcp   OPEN   ssh    OpenSSH 9.6p1",
				"[ 0.001243]    80/tcp   OPEN   http   jason-nginx 1.25",
				"[ 0.001890]    443/tcp  OPEN   https  全都用上 let's-encrypt",
				">> 注入 payload ................. 完成",
				">> 提权 ......................... 完成",
				">> 劫持 rtk-gnss0 上行链路 ........ 完成",
				">> 解密 project_secrets.enc",
				"   0f a3 9c 44 e1 7b 22 90  c8 15 6d f0 3a 61 84 2e",
				"   7d b1 05 99 e4 2c 18 76  40 ad 53 f8 0b 96 d2 3f",
				"   91 c4 2e 67 aa 18 f5 03  bd 49 70 e6 2a dc 31 85",
				"   26 f8 0d b3 59 e1 47 ac  12 78 c0 95 da 43 6e b9",
				"   b4 60 3d 17 ee 82 09 5c  f1 2b a6 48 70 d9 03 94",
				"   58 c2 1a e7 30 96 4b dd  07 65 b8 21 f4 39 ac 50",
				">> 暴力破解口令: \"solder\" ... 匹配",
				"   [####------] 40%   1.1 GB/s",
				"   [########--] 80%   2.9 GB/s",
				"   [##########] 100%  3.2 GB/s",
				"   提取 pid_tuning_notes.txt",
				"   提取 rtk_field_logs.tar.gz",
				"   提取 satellite_ephemeris.bin",
				"   提取 agv_schematics_FINAL_v2.pdf",
				"   提取 resume_FINAL_v9_FINAL.docx",
				"   提取 coffee_recipes.secret",
				"",
				"  █████╗  ██████╗ ██████╗███████╗███████╗███████╗",
				" ██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝",
				" ███████║██║     ██║     █████╗  ███████╗███████╗",
				" ██╔══██║██║     ██║     ██╔══╝  ╚════██║╚════██║",
				" ██║  ██║╚██████╗╚██████╗███████╗███████║███████║",
				" ╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝",
				"  ██████╗ ██████╗  █████╗ ███╗   ██╗████████╗███████╗██████╗",
				" ██╔════╝ ██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝██╔════╝██╔══██╗",
				" ██║  ███╗██████╔╝███████║██╔██╗ ██║   ██║   █████╗  ██║  ██║",
				" ██║   ██║██╔══██╗██╔══██║██║╚██╗██║   ██║   ██╔══╝  ██║  ██║",
				" ╚██████╔╝██║  ██║██║  ██║██║ ╚████║   ██║   ███████╗██████╔╝",
				"  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═════╝",
				"",
				"  ... 开个玩笑，这是作品集，不是大型机。",
			],
			hackNote: {
				a: "  这里的一切都是公开的 —— 运行 ",
				intro: " 看真正重点",
				art: " 看画廊",
				end: "。",
			},
			gallery: [
				["buddha", "禅意，等宽字体版"],
				["neumann", "你此刻正用的这台机器"],
				["dragon", "此处有已交付产品"],
				["rocket", "每次都是 T-0"],
			],
			galleryHeader: "画廊 —— 点击揭晓：",
			dragonCaption: "此处有已交付产品。",
			rocketCaption: "T-0 确认。上面每个项目都已离开发射台。",
			fortunes: [
				"“Talk is cheap. Show me the code.” —— Linus Torvalds",
				"“简洁是可靠性的前提。” —— Dijkstra",
				"“先解决问题，再写代码。” —— John Johnson",
				"“硬件：你能踢一脚的那部分。” —— 佚名",
				"“它在我台架上能跑。” —— 每个电子工程师",
			],
			welcomeLine1: "欢迎。这个终端会带你一步步了解我，",
			welcomeLine2a: "一次一条命令。只需按 ",
			welcomeLine2b: " 开始。",
			pressEnterToContinue: "⏎ 按回车继续",
			orTypeACommand: "或输入命令 · help",
			inputPlaceholder: "按回车继续，或输入 help",
			guidedTour: "引导之旅",
			advancing: "推进到下一章…",
			restarting: "从头重新运行引导之旅。",
			aboutRole: "电子工程师，广州。",
			aboutBody: "我做的都是落地的硬件：教育机器人、农机北斗 RTK、工业 AGV —— 从 PCB 到金属车间地板。",
			aboutFacts1: "2 家公司",
			aboutFacts2: "9 个已交付产品",
			aboutRuleA: "台架",
			aboutRuleB: "上跑不通，就绝不交付。",
			aboutStack: "日常技术栈 → ",
			introSub: "电子工程师 · 广州",
			introRows: {
				exp: "4 年+",
				delivered: "9 个产品",
				stack: "STM32 · RTK/GNSS · Jetson · PID · OpenCV",
				rule: "台架",
			},
			introRuleA: "台架",
			introRuleB: "上跑不通，就绝不交付。",
			summaryCta1: " 深入探索，或 ",
			summaryCta2: " 联系我",
			summaryCta3: "。",
			emailLabel: "邮箱",
			themeSet: (next) => `荧光已切换为 ${next} —— 再运行一次切回`,
			matrixWake: "醒醒，Neo…（任意键退出）",
			hackNotePublic: "  这里的一切都是公开的",
			gitUsage: "用法：git log | git status",
			gitStatusClean: () => "位于分支 main",
			gitStatusNothing: "无内容可提交，工作区干净",
			gitStatusShip: "（交付就是默认状态）",
			pingStats: (host) => `--- ${host} ping 统计 ---`,
			pingLost: "4 已发送，4 已接收，0% 丢包",
			pythonLine1: "真正的 Python 在浏览器里运行于 ",
			pythonLine2: "（需密码，含 numpy）",
			sudoSandwich: "好嘞。",
			sudoDenied: "jason 不在 sudoers 文件里。此事件将被上报。",
			rmReply: "想得美。",
			exitLine1: "这里没有出口。试试 ",
			exitLine2: " 吧。",
			editorReply: (cmd) => `${cmd}: 编辑器不包含在内。反正这作品集是只读的。`,
			helloLine1: "你好。点 ",
			helloLine2: " —— 你正是为此而来。",
			xyzzyReply: "一个空洞的声音说：继续交付。",
			fortyTwoReply: "正确。一切问题的答案。",
			cmdNotFound: (cmd) => `命令未找到: ${cmd}`,
			didYouMean: "你是不是想说 ",
			tryHelp: "（试试: help）",
			catNoFile: (arg) => `cat: ${arg}: 无此文件（试试: about.txt, skills.txt, contact.txt）`,
			catUsage: "用法: cat <file>",
			manNoEntry: (arg) => `没有 ${arg || "（无）"} 的手册条目`,
			tourDoneA: "★ 引导之旅到此结束 —— 你已经认识 Jason Chen 了。",
			tourDoneB: "再运行一次，或用 ",
			tourDoneC: " 回顾",
			tourDoneD: "。",
			eggPrefix: (n, total, label) => `彩蛋 ${n}/${total} —— ${label}`,
			konamiLine: "KONAMI 已接受 —— 荧光过载，功率等级：9001",
			skillsDeepA: "做深度探索",
			skillsDeepB: "联系我",
			pingHeader: (host) => `PING ${host} 56(84) 字节数据。`,
			uptimeLine1: "已运行 4 年+，9 个已交付产品，2 家公司，",
			uptimeLine2: "负载均值：烙铁、固件、再来一遍",
			unameLine: "JasonOS 2.6.10-portfolio #1 SMP x86_64 GNU/Web",
			topHeader: "PID  COMMAND  %CPU  %MEM",
		};
	}

	if (locale === "zh-Hant") {
		return {
			journey: [
				{
					label: "01 · 身份",
					text: "先問問系統：這個人是誰？",
					cmd: "whoami",
					takeaway: "Jason Chen —— 電子工程師，4 年+，廣州。",
				},
				{
					label: "02 · 能力",
					text: "接著：他到底會做什麼？",
					cmd: "skills",
					takeaway: "嵌入式 · 控制 · 定位 · 視覺 · 軟體",
				},
				{
					label: "03 · 機器",
					text: "以及背後的這台機器 ——",
					cmd: "neofetch",
					takeaway: "9 個已交付產品 · 2 家公司 · 4 年+ 在線",
				},
				{
					label: "04 · 履歷",
					text: "四年，一次一次提交。",
					cmd: "git log",
					takeaway: "AGV → RTK → 實訓 → VXS-100 → 教育機器人",
				},
				{
					label: "05 · 表演",
					text: "好的演示總得有點戲劇效果…",
					cmd: "hack",
					takeaway: "（那是假的 —— 真正的重點在後面）",
				},
				{
					label: "06 · 重點",
					text: "去掉噪音，你真正要認識的是：",
					cmd: "intro",
					takeaway: "Jason Chen —— 4 年+，9 個產品，2 家公司，一條準則。",
				},
			],
			navTitle: "旅程",
			navSubtitle: "按 Enter 逐步瀏覽",
			navNotStarted: "Jason 是誰？",
			skills: [
				["嵌入式", 9, "C/C++ · STM32 · PCB 交付 · 感測整合"],
				["控制", 9, "PID 整定 · 運動控制 · 循跡與 AGV"],
				["定位", 8, "北斗 RTK · GNSS · LPWAN 現場部署"],
				["視覺", 8, "OpenCV · Jetson 邊緣 AI · 檢測管線"],
				["軟體", 8, "Python · TypeScript · Next.js · 小程序"],
			],
			skillsHeader: "能力 —— 在金屬車間地板上校準過的",
			skillsFooterA: "上面每一格背後都有",
			skillsFooterB: "已交付硬體",
			stats: [
				["經驗", "4 年+，電子 / 嵌入式"],
				["交付", "9 個產品，2 家公司"],
				["專注", "落在金屬車間地板上的硬體"],
				["技術棧", "C/C++ · STM32 · PCB · RTK/GNSS · Jetson · Web"],
				["準則", "在台架上跑不通，就絕不交付"],
			],
			statsHeader: "一圖速覽",
			manual: [
				["next / skip", "把引導之旅推進一章", "next"],
				["restart", "從頭重新執行引導", "restart"],
				["intro / me", "收尾 —— 一句話說清我是誰", "intro"],
				["summary / stats", "一圖速覽 —— 關鍵亮點", "summary"],
				["skills", "能力條，實打實的那種", "skills"],
				["about / whoami", "Jason 是誰", "about"],
				["contact / social", "信箱 + 社交主頁", "contact"],
				["neofetch", "系統資訊，作品集版", "neofetch"],
				["git log", "一段職業生涯的提交歷史", "git log"],
				["hack", "好萊塢式入侵（當然是假的）", "hack"],
				["art", "ASCII 畫廊 —— 佛像、馮·諾伊曼等", "art"],
				["matrix", "follow the white rabbit", "matrix"],
				["theme", "切換綠 / 琥珀螢光", "theme"],
				["cat <file>", "about.txt · skills.txt · contact.txt", "cat about.txt"],
				["ping <host>", "看看網路還能不能用", "ping"],
				["fortune", "心靈雞湯分發器", "fortune"],
				["history", "你的命令歷史", "history"],
				["man <cmd>", "手冊頁", "man tour"],
				["help", "列出命令", "help"],
				["clear", "清屏", "clear"],
			],
			manualHeader: "可用命令 —— 點任意一個即可：",
			manualEgg: "真正的駭客不看手冊。",
			bootLog: [
				"[    0.000000] JasonOS 2.6.10 正在 portfolio-cpu0 上啟動",
				"[    0.000421] CPU: 好奇心 @ 5.15GHz (8 核，1 個大腦)",
				"[    0.001024] 記憶體: 128TB 想法空間可用",
				"[    0.002048] solder0: 偵測到 USB 烙鐵，加熱至 350°C",
				"[    0.003145] rtk-gnss0: 31 顆衛星鎖定，解算：RTK-FIXED",
				"[    0.004096] pid0: Kp=1.8 Ki=0.4 Kd=0.06 —— 迴路穩定",
				"[    0.005512] agv-can0: 鏈路已連接，500 kbit/s，金屬地板就緒",
				"[    0.006331] jetson0: CUDA 核心喚醒，邊緣 AI 管線待命",
				"[    0.007222] coffee0: 咖啡依賴已解決（關鍵）",
				"[    0.008192] 掛載 /dev/projects 到 /home/jason ... 完成",
				"[  OK  ] 已啟動 Portfolio Shell。",
				"[  OK  ] 已到達目標 已交付產品 (9)。",
				"[  OK  ] 已到達目標 公司 (2)。",
				"[  OK  ] 已啟動彩蛋守護進程 (4 個彩蛋隱藏)。",
				"",
			],
			bootTitle: "JasonOS 2.6.10 —— portfolio shell",
			neofetchInfo: [
				["OS", "JasonOS 2.6.10 portfolio x86_64"],
				["Host", "中國廣州"],
				["Role", "電子工程師"],
				["Kernel", "curiosity-5.15-rc2"],
				["Uptime", "4 年+ 做硬體"],
				["Packages", "9 個已交付專案"],
				["Shell", "jsh 1.0（就這玩意兒）"],
				["Editor", "能跑就行"],
			],
			gitLog: [
				"* 9f3e2a1 (HEAD -> main) feat: 重工業 AGV 遙控，金屬地板驗證",
				"* 4c7b8d2 feat: 北斗 RTK 批量交付 —— 農機保持線上",
				"* a1e5f90 fix: 實訓車高 Kp 下的 PID 振盪",
				"* 77d0c3e feat: VXS-100 工業遙控 —— 面板到 PCB",
				"* 52b9aa4 feat: 高校 IoT 實驗室教育機器人編隊",
				"* 2e08f17 chore: coffee.iv 滴濾 —— 以上所有事的依賴",
			],
			gitStatus: [
				"  位於分支 main",
				"  無內容可提交，工作區乾淨",
				"  （交付就是預設狀態）",
			],
			hackLines: [
				"[ 0.000021] jsh: 入侵模組已載入",
				"[ 0.000112] 正在掃描 portfolio.local 的 65535 個連接埠 ...",
				"[ 0.000987]    22/tcp   OPEN   ssh    OpenSSH 9.6p1",
				"[ 0.001243]    80/tcp   OPEN   http   jason-nginx 1.25",
				"[ 0.001890]    443/tcp  OPEN   https  全都用上 let's-encrypt",
				">> 注入 payload ................. 完成",
				">> 提權 ......................... 完成",
				">> 劫持 rtk-gnss0 上行鏈路 ........ 完成",
				">> 解密 project_secrets.enc",
				"   0f a3 9c 44 e1 7b 22 90  c8 15 6d f0 3a 61 84 2e",
				"   7d b1 05 99 e4 2c 18 76  40 ad 53 f8 0b 96 d2 3f",
				"   91 c4 2e 67 aa 18 f5 03  bd 49 70 e6 2a dc 31 85",
				"   26 f8 0d b3 59 e1 47 ac  12 78 c0 95 da 43 6e b9",
				"   b4 60 3d 17 ee 82 09 5c  f1 2b a6 48 70 d9 03 94",
				"   58 c2 1a e7 30 96 4b dd  07 65 b8 21 f4 39 ac 50",
				">> 暴力破解口令: \"solder\" ... 匹配",
				"   [####------] 40%   1.1 GB/s",
				"   [########--] 80%   2.9 GB/s",
				"   [##########] 100%  3.2 GB/s",
				"   提取 pid_tuning_notes.txt",
				"   提取 rtk_field_logs.tar.gz",
				"   提取 satellite_ephemeris.bin",
				"   提取 agv_schematics_FINAL_v2.pdf",
				"   提取 resume_FINAL_v9_FINAL.docx",
				"   提取 coffee_recipes.secret",
				"",
				"  █████╗  ██████╗ ██████╗███████╗███████╗███████╗",
				" ██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝",
				" ███████║██║     ██║     █████╗  ███████╗███████╗",
				" ██╔══██║██║     ██║     ██╔══╝  ╚════██║╚════██║",
				" ██║  ██║╚██████╗╚██████╗███████╗███████║███████║",
				" ╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝",
				"  ██████╗ ██████╗  █████╗ ███╗   ██╗████████╗███████╗██████╗",
				" ██╔════╝ ██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝██╔════╝██╔══██╗",
				" ██║  ███╗██████╔╝███████║██╔██╗ ██║   ██║   █████╗  ██║  ██║",
				" ██║   ██║██╔══██╗██╔══██║██║╚██╗██║   ██║   ██╔══╝  ██║  ██║",
				" ╚██████╔╝██║  ██║██║  ██║██║ ╚████║   ██║   ███████╗██████╔╝",
				"  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═════╝",
				"",
				"  ... 開個玩笑，這是作品集，不是大型機。",
			],
			hackNote: {
				a: "  這裡的一切都是公開的 —— 執行 ",
				intro: " 看真正重點",
				art: " 看畫廊",
				end: "。",
			},
			gallery: [
				["buddha", "禪意，等寬字體版"],
				["neumann", "你此刻正用的這台機器"],
				["dragon", "此處有已交付產品"],
				["rocket", "每次都是 T-0"],
			],
			galleryHeader: "畫廊 —— 點擊揭曉：",
			dragonCaption: "此處有已交付產品。",
			rocketCaption: "T-0 確認。上面每個專案都已離開發射台。",
			fortunes: [
				"“Talk is cheap. Show me the code.” —— Linus Torvalds",
				"“簡潔是可靠性的前提。” —— Dijkstra",
				"“先解決問題，再寫程式碼。” —— John Johnson",
				"“硬體：你能踢一腳的那部分。” —— 佚名",
				"“它在我台架上能跑。” —— 每個電子工程師",
			],
			welcomeLine1: "歡迎。這個終端會帶你一步步了解我，",
			welcomeLine2a: "一次一條命令。只需按 ",
			welcomeLine2b: " 開始。",
			pressEnterToContinue: "⏎ 按 Enter 繼續",
			orTypeACommand: "或輸入命令 · help",
			inputPlaceholder: "按 Enter 繼續，或輸入 help",
			guidedTour: "引導之旅",
			advancing: "推進到下一章…",
			restarting: "從頭重新執行引導之旅。",
			aboutRole: "電子工程師，廣州。",
			aboutBody: "我做的都是落地的硬體：教育機器人、農機北斗 RTK、工業 AGV —— 從 PCB 到金屬車間地板。",
			aboutFacts1: "2 家公司",
			aboutFacts2: "9 個已交付產品",
			aboutRuleA: "台架",
			aboutRuleB: "上跑不通，就絕不交付。",
			aboutStack: "日常技術棧 → ",
			introSub: "電子工程師 · 廣州",
			introRows: {
				exp: "4 年+",
				delivered: "9 個產品",
				stack: "STM32 · RTK/GNSS · Jetson · PID · OpenCV",
				rule: "台架",
			},
			introRuleA: "台架",
			introRuleB: "上跑不通，就絕不交付。",
			summaryCta1: " 深入探索，或 ",
			summaryCta2: " 聯絡我",
			summaryCta3: "。",
			emailLabel: "信箱",
			themeSet: (next) => `螢光已切換為 ${next} —— 再執行一次切回`,
			matrixWake: "醒醒，Neo…（任意鍵退出）",
			hackNotePublic: "  這裡的一切都是公開的",
			gitUsage: "用法：git log | git status",
			gitStatusClean: () => "位於分支 main",
			gitStatusNothing: "無內容可提交，工作區乾淨",
			gitStatusShip: "（交付就是預設狀態）",
			pingStats: (host) => `--- ${host} ping 統計 ---`,
			pingLost: "4 已傳送，4 已接收，0% 封包遺失",
			pythonLine1: "真正的 Python 在瀏覽器裡執行於 ",
			pythonLine2: "（需密碼，含 numpy）",
			sudoSandwich: "好嘞。",
			sudoDenied: "jason 不在 sudoers 檔案裡。此事件將被上報。",
			rmReply: "想得美。",
			exitLine1: "這裡沒有出口。試試 ",
			exitLine2: " 吧。",
			editorReply: (cmd) => `${cmd}: 編輯器不包含在內。反正這作品集是唯讀的。`,
			helloLine1: "你好。點 ",
			helloLine2: " —— 你正是為此而來。",
			xyzzyReply: "一個空洞的聲音說：繼續交付。",
			fortyTwoReply: "正確。一切問題的答案。",
			cmdNotFound: (cmd) => `命令未找到: ${cmd}`,
			didYouMean: "你是不是想說 ",
			tryHelp: "（試試: help）",
			catNoFile: (arg) => `cat: ${arg}: 無此檔案（試試: about.txt, skills.txt, contact.txt）`,
			catUsage: "用法: cat <file>",
			manNoEntry: (arg) => `沒有 ${arg || "（無）"} 的手冊條目`,
			tourDoneA: "★ 引導之旅到此結束 —— 你已經認識 Jason Chen 了。",
			tourDoneB: "再執行一次，或用 ",
			tourDoneC: " 回顧",
			tourDoneD: "。",
			eggPrefix: (n, total, label) => `彩蛋 ${n}/${total} —— ${label}`,
			konamiLine: "KONAMI 已接受 —— 螢光過載，功率等級：9001",
			skillsDeepA: "做深度探索",
			skillsDeepB: "聯絡我",
			pingHeader: (host) => `PING ${host} 56(84) 位元組資料。`,
			uptimeLine1: "已執行 4 年+，9 個已交付產品，2 家公司，",
			uptimeLine2: "負載均值：烙鐵、韌體、再來一遍",
			unameLine: "JasonOS 2.6.10-portfolio #1 SMP x86_64 GNU/Web",
			topHeader: "PID  COMMAND  %CPU  %MEM",
		};
	}

	// English (default)
	return {
		journey: [
			{
				label: "01 · who",
				text: "first, who is this person? let's ask the system.",
				cmd: "whoami",
				takeaway: "Jason Chen — electronics engineer, 4+ yrs, Guangzhou.",
			},
			{
				label: "02 · capability",
				text: "next: what can they actually do?",
				cmd: "skills",
				takeaway: "embedded · control · positioning · vision · software",
			},
			{
				label: "03 · the machine",
				text: "and the machine behind it —",
				cmd: "neofetch",
				takeaway: "9 shipped products · 2 companies · 4+ yrs uptime",
			},
			{
				label: "04 · career",
				text: "four years, one commit at a time.",
				cmd: "git log",
				takeaway: "AGV → RTK → shixun → VXS-100 → edu robots",
			},
			{
				label: "05 · theater",
				text: "and because every good demo needs a little theater…",
				cmd: "hack",
				takeaway: "(that was fake — the real point is next)",
			},
			{
				label: "06 · the point",
				text: "strip the noise, and this is who you're actually meeting:",
				cmd: "intro",
				takeaway: "Jason Chen — 4+ yrs, 9 products, 2 companies, one rule.",
			},
		],
		navTitle: "journey",
		navSubtitle: "press Enter to step through",
		navNotStarted: "who is Jason?",
		skills: [
			["embedded", 9, "C/C++ · STM32 · PCB bring-up · sensor integration"],
			["control", 9, "PID tuning · motion control · line-follow & AGV"],
			["position", 8, "Beidou RTK · GNSS · LPWAN field deployment"],
			["vision", 8, "OpenCV · edge AI on Jetson · detection pipelines"],
			["software", 8, "Python · TypeScript · Next.js · mini programs"],
		],
		skillsHeader: "CAPABILITY — calibrated on metal floors",
		skillsFooterA: "every bar above has ",
		skillsFooterB: "shipped hardware",
		stats: [
			["Experience", "4+ years, electronics / embedded"],
			["Shipped", "9 products, 2 companies"],
			["Focus", "hardware that lands on metal floors"],
			["Stack", "C/C++ · STM32 · PCB · RTK/GNSS · Jetson · Web"],
			["Rule", "if it doesn't work on the bench, it never leaves"],
		],
		statsHeader: "AT A GLANCE",
		manual: [
			["next / skip", "advance the guided tour one chapter", "next"],
			["restart", "run the guided tour from the top", "restart"],
			["intro / me", "the payoff — who I am, in one breath", "intro"],
			["summary / stats", "everything at a glance — the highlights", "summary"],
			["skills", "capability bars, the honest kind", "skills"],
			["about / whoami", "who is Jason", "about"],
			["contact / social", "email + socials", "contact"],
			["neofetch", "system info, portfolio edition", "neofetch"],
			["git log", "commit history of a career", "git log"],
			["hack", "hollywood-style intrusion (fake, obviously)", "hack"],
			["art", "the ASCII gallery — buddha, neumann & friends", "art"],
			["matrix", "follow the white rabbit", "matrix"],
			["theme", "toggle green / amber phosphor", "theme"],
			["cat <file>", "about.txt · skills.txt · contact.txt", "cat about.txt"],
			["ping <host>", "check if the internet still works", "ping"],
			["fortune", "wisdom dispenser", "fortune"],
			["history", "your command history", "history"],
			["man <cmd>", "manual pages", "man tour"],
			["help", "list commands", "help"],
			["clear", "wipe the screen", "clear"],
		],
		manualHeader: "available commands — click any of them:",
		manualEgg: "real hackers don't read manuals.",
		bootLog: [
			"[    0.000000] JasonOS 2.6.10 booting on portfolio-cpu0",
			"[    0.000421] CPU: curiosity @ 5.15GHz (8 cores, 1 brain)",
			"[    0.001024] Memory: 128TB idea-space available",
			"[    0.002048] solder0: USB iron detected, heating to 350°C",
			"[    0.003145] rtk-gnss0: 31 satellites locked, fix: RTK-FIXED",
			"[    0.004096] pid0: Kp=1.8 Ki=0.4 Kd=0.06 — loop stable",
			"[    0.005512] agv-can0: link up, 500 kbit/s, metal floor ready",
			"[    0.006331] jetson0: CUDA cores awake, edge-AI pipeline armed",
			"[    0.007222] coffee0: drip dependency resolved (critical)",
			"[    0.008192] mounting /dev/projects on /home/jason ... done",
			"[  OK  ] Started Portfolio Shell.",
			"[  OK  ] Reached target Shipped Projects (9).",
			"[  OK  ] Reached target Companies (2).",
			"[  OK  ] Started Easter Egg Daemon (4 eggs hidden).",
			"",
		],
		bootTitle: "JasonOS 2.6.10 — portfolio shell",
		neofetchInfo: [
			["OS", "JasonOS 2.6.10 portfolio x86_64"],
			["Host", "Guangzhou, China"],
			["Role", "Electronics Engineer"],
			["Kernel", "curiosity-5.15-rc2"],
			["Uptime", "4+ yrs building hardware"],
			["Packages", "9 shipped projects"],
			["Shell", "jsh 1.0 (this thing)"],
			["Editor", "whatever gets it done"],
		],
		gitLog: [
			"* 9f3e2a1 (HEAD -> main) feat: heavy-industry AGV remote, metal-floor proven",
			"* 4c7b8d2 feat: Beidou RTK batch bring-up — farm machines stay on line",
			"* a1e5f90 fix: PID oscillation on shixun car at high Kp",
			"* 77d0c3e feat: VXS-100 industrial remote — panel to PCB",
			"* 52b9aa4 feat: education robot fleet for university IoT labs",
			"* 2e08f17 chore: coffee.iv drip — dependency of all of the above",
		],
		gitStatus: [
			"  on branch main",
			"  nothing to commit, working tree clean",
			"  (shipping is the default state)",
		],
		hackLines: [
			"[ 0.000021] jsh: intrusion module loaded",
			"[ 0.000112] scanning 65535 ports on portfolio.local ...",
			"[ 0.000987]    22/tcp   OPEN   ssh    OpenSSH 9.6p1",
			"[ 0.001243]    80/tcp   OPEN   http   jason-nginx 1.25",
			"[ 0.001890]    443/tcp  OPEN   https  let's-encrypt-everything",
			">> injecting payload ................. done",
			">> escalating privileges ............. done",
			">> hijacking rtk-gnss0 uplink ........ done",
			">> decrypting project_secrets.enc",
			"   0f a3 9c 44 e1 7b 22 90  c8 15 6d f0 3a 61 84 2e",
			"   7d b1 05 99 e4 2c 18 76  40 ad 53 f8 0b 96 d2 3f",
			"   91 c4 2e 67 aa 18 f5 03  bd 49 70 e6 2a dc 31 85",
			"   26 f8 0d b3 59 e1 47 ac  12 78 c0 95 da 43 6e b9",
			"   b4 60 3d 17 ee 82 09 5c  f1 2b a6 48 70 d9 03 94",
			"   58 c2 1a e7 30 96 4b dd  07 65 b8 21 f4 39 ac 50",
			">> brute-forcing passphrase: \"solder\" ... MATCH",
			"   [####------] 40%   1.1 GB/s",
			"   [########--] 80%   2.9 GB/s",
			"   [##########] 100%  3.2 GB/s",
			"   extracting  pid_tuning_notes.txt",
			"   extracting  rtk_field_logs.tar.gz",
			"   extracting  satellite_ephemeris.bin",
			"   extracting  agv_schematics_FINAL_v2.pdf",
			"   extracting  resume_FINAL_v9_FINAL.docx",
			"   extracting  coffee_recipes.secret",
			"",
			"  █████╗  ██████╗ ██████╗███████╗███████╗███████╗",
			" ██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝",
			" ███████║██║     ██║     █████╗  ███████╗███████╗",
			" ██╔══██║██║     ██║     ██╔══╝  ╚════██║╚════██║",
			" ██║  ██║╚██████╗╚██████╗███████╗███████║███████║",
			" ╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝",
			"  ██████╗ ██████╗  █████╗ ███╗   ██╗████████╗███████╗██████╗",
			" ██╔════╝ ██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝██╔════╝██╔══██╗",
			" ██║  ███╗██████╔╝███████║██╔██╗ ██║   ██║   █████╗  ██║  ██║",
			" ██║   ██║██╔══██╗██╔══██║██║╚██╗██║   ██║   ██╔══╝  ██║  ██║",
			" ╚██████╔╝██║  ██║██║  ██║██║ ╚████║   ██║   ███████╗██████╔╝",
			"  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═════╝",
			"",
			"  ... just kidding. this is a portfolio, not a mainframe.",
		],
		hackNote: {
			a: "   everything here is public — run ",
			intro: " for the real point, or ",
			art: " for the gallery",
			end: ".",
		},
		gallery: [
			["buddha", "zen, in monospace"],
			["neumann", "the machine you're using right now"],
			["dragon", "here be shipped products"],
			["rocket", "T-0, every time"],
		],
		galleryHeader: "the gallery — click to unveil:",
		dragonCaption: "here be shipped products.",
		rocketCaption: "T-0 confirmed. every project above left the pad.",
		fortunes: [
			"“Talk is cheap. Show me the code.” — Linus Torvalds",
			"“Simplicity is prerequisite for reliability.” — Dijkstra",
			"“First, solve the problem. Then, write the code.” — John Johnson",
			"“Hardware: the part you can kick.” — anonymous",
			"“It works on my bench.” — every electronics engineer ever",
		],
		welcomeLine1: "welcome. this terminal will walk you through me, ",
		welcomeLine2a: "one command at a time. just press ",
		welcomeLine2b: " to begin.",
		pressEnterToContinue: "⏎ press Enter to continue",
		orTypeACommand: "or type a command · help",
		inputPlaceholder: "press Enter to continue, or type help",
		guidedTour: "guided tour",
		advancing: "advancing to the next chapter…",
		restarting: "restarting the guided tour from the top.",
		aboutRole: "electronics engineer, Guangzhou.",
		aboutBody: "landed hardware: education robots, Beidou RTK for farm machines, industrial AGVs — from PCB to metal floor.",
		aboutFacts1: "2 companies",
		aboutFacts2: "9 shipped products",
		aboutRuleA: "bench",
		aboutRuleB: ", it never leaves.",
		aboutStack: "daily stack → ",
		introSub: "Electronics Engineer · Guangzhou",
		introRows: {
			exp: "4+ years",
			delivered: "9 products",
			stack: "STM32 · RTK/GNSS · Jetson · PID · OpenCV",
			rule: "if it doesn't work on the bench,",
		},
		introRuleA: "if it doesn't work on the bench,",
		introRuleB: " it never leaves.",
		summaryCta1: " for the deep dive, or ",
		summaryCta2: " to reach me",
		summaryCta3: ".",
		emailLabel: "email",
		themeSet: (next) => `phosphor set to ${next} — run again to flip back`,
		matrixWake: "wake up, Neo… (any key to exit)",
		hackNotePublic: "   everything here is public",
		gitUsage: "usage: git log | git status",
		gitStatusClean: () => "on branch main",
		gitStatusNothing: "nothing to commit, working tree clean",
		gitStatusShip: "(shipping is the default state)",
		pingStats: (host) => `--- ${host} ping statistics ---`,
		pingLost: "4 transmitted, 4 received, 0% packet loss",
		pythonLine1: "real python runs in-browser at ",
		pythonLine2: " (password-gated, numpy included)",
		sudoSandwich: "okay.",
		sudoDenied: "jason is not in the sudoers file. This incident will be reported.",
		rmReply: "nice try.",
		exitLine1: "there is no escape. try ",
		exitLine2: " instead.",
		editorReply: (cmd) => `${cmd}: editor not included. this portfolio is read-only anyway.`,
		helloLine1: "hello. click ",
		helloLine2: " — that's why you're here.",
		xyzzyReply: "a hollow voice says: keep shipping.",
		fortyTwoReply: "correct. the answer to everything.",
		cmdNotFound: (cmd) => `command not found: ${cmd}`,
		didYouMean: "did you mean ",
		tryHelp: "(try: help)",
		catNoFile: (arg) => `cat: ${arg}: no such file (try: about.txt, skills.txt, contact.txt)`,
		catUsage: "usage: cat <file>",
		manNoEntry: (arg) => `no manual entry for ${arg || "(nothing)"}`,
		tourDoneA: "★ that's the guided tour — you've met Jason Chen.",
		tourDoneB: "press ",
		tourDoneC: " to run it again, or recap with ",
		tourDoneD: ".",
		eggPrefix: (n, total, label) => `easter egg ${n}/${total} — ${label}`,
		konamiLine: "KONAMI ACCEPTED — phosphor overload, power level: 9001",
		skillsDeepA: " for the deep dive, or ",
		skillsDeepB: " to reach me",
		pingHeader: (host) => `PING ${host} 56(84) bytes of data.`,
		uptimeLine1: "up 4+ years, 9 shipped projects, 2 companies,",
		uptimeLine2: "load average: solder, firmware, repeat",
		unameLine: "JasonOS 2.6.10-portfolio #1 SMP x86_64 GNU/Web",
		topHeader: "PID  COMMAND  %CPU  %MEM",
	};
}

export function getTermStrings(locale: Locale): TermStrings {
	return build(locale);
}
