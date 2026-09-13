"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

export type Locale = "en" | "zh-Hans" | "zh-Hant";

const STORAGE_KEY = "techfolio-locale";

type Dict = Record<string, string>;

const en: Dict = {
	"nav.archive": "Archive",
	"story.01": "Experience",
	"story.02": "Connection",
	"story.03": "Goal",
	"story.04": "Research",
	"story.05": "Next",
	"hero.role": "Electronic Engineer",
	"hero.headline": "From Hardware\nto Intelligent Systems.",
	"hero.blurb":
		"I build systems that connect electronics, embedded systems, robotics and AI.",
	"hero.chip.electronics": "Electronics",
	"hero.chip.embedded": "Embedded",
	"hero.chip.robotics": "Robotics",
	"hero.chip.ai": "AI",
	"hero.scroll": "Scroll",
	"core.kicker": "01 — Experience",
	"core.title": "Four Projects.\nFour Capabilities.",
	"core.blurb":
		"Four different projects gradually shaped the capabilities I now want to bring into one system.",
	"core.open": "Open brief",
	"core.rtk.title": "RTK & Agricultural Sensing",
	"core.rtk.cap": "Precise Positioning",
	"core.rtk.body":
		"Developed RTK positioning and field sensing hardware, connecting precise positioning with embedded systems and wireless communication.",
	"core.rtk.c1": "RTK",
	"core.rtk.c2": "GNSS",
	"core.rtk.c3": "LPWAN",
	"core.rtk.c4": "Embedded",
	"core.agv.title": "Industrial AGV",
	"core.agv.cap": "Autonomous Operation",
	"core.agv.body":
		"Worked on AGV control, embedded systems and autonomous robotic operation.",
	"core.agv.c1": "Robotics",
	"core.agv.c2": "ROS",
	"core.agv.c3": "Motion Control",
	"core.fire.title": "Edge AI Fire Warning",
	"core.fire.cap": "Intelligent Perception",
	"core.fire.body":
		"Built an edge-AI system combining computer vision, embedded computing and robotic control.",
	"core.fire.c1": "Computer Vision",
	"core.fire.c2": "Jetson",
	"core.fire.c3": "YOLO",
	"core.fire.c4": "ROS",
	"core.wear.title": "Smart Wearable",
	"core.wear.cap": "Multi-sensor Systems",
	"core.wear.body":
		"Integrated multiple sensors, wireless communication and real-time monitoring into one system.",
	"core.wear.c1": "Sensors",
	"core.wear.c2": "ESP32",
	"core.wear.c3": "BLE / Wi-Fi",
	"core.wear.c4": "IoT",
	"archive.kicker": "The Full Journey",
	"archive.prompt": "Projects · Work · Experiments · Activities",
	"archive.title": "The Full Journey",
	"archive.cta": "Explore the complete project archive",
	"archive.back": "Back to story",
	"archive.page.blurb":
		"Chronological engineering journey — companies, university projects, make and society. For post-presentation exploration.",
	"conn.kicker": "02 — Connection",
	"conn.title": "Different Experiences.\nOne System.",
	"conn.statement":
		"These experiences are not isolated projects. They are different parts of the same system.",
	"conn.s1.from": "RTK",
	"conn.s1.to": "Precise Positioning",
	"conn.s2.from": "AGV",
	"conn.s2.to": "Autonomy",
	"conn.s3.from": "Edge AI",
	"conn.s3.to": "Perception",
	"conn.s4.from": "Sensors",
	"conn.s4.to": "Sensing",
	"conn.merge.kicker": "Convergence",
	"conn.merge.title": "System Integration",
	"conn.merge.goal": "Intelligent UAV Systems",
	"goal.kicker": "03 — Goal",
	"goal.title": "Intelligent\nAgricultural\nUAV Systems",
	"goal.tagline": "From “Flying” to “Working”.",
	"goal.flow1": "Position",
	"goal.flow2": "Perceive",
	"goal.flow3": "Decide",
	"goal.flow4": "Act",
	"research.kicker": "04 — Research",
	"research.title": "What I Want to Explore",
	"research.d1.title": "Precise Positioning",
	"research.d1.tech": "RTK · GNSS · Multi-sensor Fusion",
	"research.d2.title": "Intelligent Perception",
	"research.d2.tech": "UAV Sensors · Edge AI · Computer Vision",
	"research.d3.title": "Autonomous Operation",
	"research.d3.tech": "Robotics · Path Planning · Motion Control",
	"research.d4.title": "Air–Ground Collaboration",
	"research.d4.tech": "UAV · Ground IoT · AGV · Field Sensors",
	"research.q.kicker": "A Direction I Want to Explore",
	"research.q.body":
		"How can UAVs, precise positioning, edge AI and ground sensing systems work together to support autonomous agricultural operations?",
	"fit.kicker": "Research Fit",
	"fit.blurb":
		"Generic alignment for meetings — customize with verified supervisor topics only.",
	"fit.mine": "My Experience",
	"fit.yours": "Your Research",
	"fit.connect": "Potential Connection",
	"next.kicker": "05 — Next",
	"next.title": "From Engineering\nto Research.",
	"next.s1.title": "Build the foundation",
	"next.s1.body": "UAV · Agriculture · Positioning · Communication",
	"next.s2.title": "Find the research problem",
	"next.s2.body": "Work with a supervisor to identify a meaningful problem.",
	"next.s3.title": "Build & experiment",
	"next.s3.body": "Hardware → Algorithm → System",
	"next.s4.title": "Validate in real scenarios",
	"next.s4.body": "Agricultural environments and real operating constraints.",
	"next.s5.title": "Intelligent Agricultural UAV Systems",
	"next.s5.body": "The direction I want to grow toward.",
	"journey.kicker": "Archive",
	"journey.title": "Full project archive",
	"journey.projects": "Projects",
	"journey.projects.whisper":
		"From wearables and AGV to RTK — the product line that shaped the path.",
	"journey.companies": "Companies",
	"journey.companies.whisper":
		"Zongheng, CVTE, Moore — hardware to interaction in the field.",
	"journey.make": "MAKE",
	"journey.make.whisper":
		"Smart Helmet and desk builds — shipping outside the day job.",
	"journey.society": "Society",
	"journey.society.whisper":
		"Team, campus, volunteering — practice beyond the lab.",
	"journey.peek": "Open",
	"journey.brief": "Brief",
	"journey.close": "Close",
	"journey.end": "Still making — toward intelligent systems and low-altitude tech.",
	"journey.end.sub": "The path continues.",
	"journey.lightbox.hint": "Scroll to zoom · click outside to close",
	"exp.kicker": "Experience",
	"exp.title": "Where I built",
	"exp.zongheng.role": "Electronic Engineer",
	"exp.zongheng.company": "Guangzhou Zongheng Intelligent Technology",
	"exp.zongheng.tags": "Robotics · AGV · RTK · Embedded · Circuit",
	"exp.cvte.role": "PCB / Hardware Engineering",
	"exp.cvte.company": "CVTE",
	"exp.cvte.tags": "Altium · High-speed · Impedance · SMT",
	"exp.moore.role": "Interactive / New Media",
	"exp.moore.company": "Shenzhen Moore Creative",
	"exp.moore.tags": "TouchDesigner · Sensors · Immersive",
	"skills.label": "Technology",
	"skills.hardware": "Hardware",
	"skills.embedded": "Embedded",
	"skills.robotics": "Robotics",
	"skills.ai": "AI",
	"skills.uav": "UAV / Emerging",
	"contact.kicker": "Contact",
	"contact.title": "Let’s build something real.",
	"contact.body":
		"Open to conversations about electronics, embedded systems, robotics, AI hardware, and intelligent agricultural UAV research.",
	"contact.emailMe": "Email Me",
	"contact.connect": "Connect",
	"contact.email": "Email",
	"contact.based": "Based in",
	"contact.location": "Macao SAR, China",
	"contact.locationLabel": "Location",
	"contact.city": "Foshan, Guangdong",
	"contact.profiles": "Profiles",
	"lang.label": "Language",
};

const zhHans: Dict = {
	"nav.archive": "档案",
	"story.01": "经历",
	"story.02": "连接",
	"story.03": "目标",
	"story.04": "研究",
	"story.05": "下一步",
	"hero.role": "电子工程师",
	"hero.headline": "从硬件\n到智能系统。",
	"hero.blurb":
		"我构建连接电子、嵌入式、机器人与人工智能的系统。",
	"hero.chip.electronics": "电子",
	"hero.chip.embedded": "嵌入式",
	"hero.chip.robotics": "机器人",
	"hero.chip.ai": "人工智能",
	"hero.scroll": "下滑",
	"core.kicker": "01 — 经历",
	"core.title": "四个项目。\n四种能力。",
	"core.blurb":
		"四个不同的项目，逐渐塑造了我希望汇入同一系统的能力。",
	"core.open": "打开简介",
	"core.rtk.title": "RTK 与农业传感",
	"core.rtk.cap": "精准定位",
	"core.rtk.body":
		"开发 RTK 定位与田间传感硬件，把精准定位与嵌入式、无线通信连在一起。",
	"core.rtk.c1": "RTK",
	"core.rtk.c2": "GNSS",
	"core.rtk.c3": "LPWAN",
	"core.rtk.c4": "嵌入式",
	"core.agv.title": "工业 AGV",
	"core.agv.cap": "自主运行",
	"core.agv.body": "参与 AGV 控制、嵌入式系统与自主机器人运行。",
	"core.agv.c1": "机器人",
	"core.agv.c2": "ROS",
	"core.agv.c3": "运动控制",
	"core.fire.title": "边缘 AI 火灾预警",
	"core.fire.cap": "智能感知",
	"core.fire.body":
		"构建结合计算机视觉、嵌入式计算与机器人控制的边缘 AI 系统。",
	"core.fire.c1": "计算机视觉",
	"core.fire.c2": "Jetson",
	"core.fire.c3": "YOLO",
	"core.fire.c4": "ROS",
	"core.wear.title": "智能穿戴",
	"core.wear.cap": "多传感系统",
	"core.wear.body":
		"把多传感、无线通信与实时监测集成到同一套系统中。",
	"core.wear.c1": "传感",
	"core.wear.c2": "ESP32",
	"core.wear.c3": "BLE / Wi-Fi",
	"core.wear.c4": "IoT",
	"archive.kicker": "完整旅程",
	"archive.prompt": "项目 · 工作 · 实验 · 活动",
	"archive.title": "完整旅程",
	"archive.cta": "查看完整项目档案",
	"archive.back": "返回主叙事",
	"archive.page.blurb":
		"按时间线整理的工程旅程——公司、大学项目、造物与社会实践。适合会后深入查看。",
	"conn.kicker": "02 — 连接",
	"conn.title": "不同经历。\n同一系统。",
	"conn.statement":
		"这些经历不是孤立项目，而是同一套系统的不同部分。",
	"conn.s1.from": "RTK",
	"conn.s1.to": "精准定位",
	"conn.s2.from": "AGV",
	"conn.s2.to": "自主",
	"conn.s3.from": "边缘 AI",
	"conn.s3.to": "感知",
	"conn.s4.from": "传感 / 穿戴",
	"conn.s4.to": "实时传感",
	"conn.merge.kicker": "汇聚",
	"conn.merge.title": "系统集成",
	"conn.merge.goal": "智能无人机系统",
	"goal.kicker": "03 — 目标",
	"goal.title": "智能\n农业\n无人机系统",
	"goal.tagline": "从「会飞」到「能干活」。",
	"goal.flow1": "定位",
	"goal.flow2": "感知",
	"goal.flow3": "决策",
	"goal.flow4": "执行",
	"research.kicker": "04 — 研究",
	"research.title": "我想探索什么",
	"research.d1.title": "精准定位",
	"research.d1.tech": "RTK · GNSS · 多传感融合",
	"research.d2.title": "智能感知",
	"research.d2.tech": "无人机传感 · 边缘 AI · 计算机视觉",
	"research.d3.title": "自主作业",
	"research.d3.tech": "机器人 · 路径规划 · 运动控制",
	"research.d4.title": "空地协同",
	"research.d4.tech": "无人机 · 地面 IoT · AGV · 田间传感",
	"research.q.kicker": "我想探索的方向",
	"research.q.body":
		"无人机、精准定位、边缘 AI 与地面传感系统，如何协同支撑自主农业作业？",
	"fit.kicker": "研究契合",
	"fit.blurb": "会面前用已核实的导师方向自定义——不要编造论文或成果。",
	"fit.mine": "我的经历",
	"fit.yours": "导师研究",
	"fit.connect": "可能的连接",
	"next.kicker": "05 — 下一步",
	"next.title": "从工程\n到研究。",
	"next.s1.title": "打好基础",
	"next.s1.body": "无人机 · 农业 · 定位 · 通信",
	"next.s2.title": "找到研究问题",
	"next.s2.body": "与导师一起识别有意义的问题。",
	"next.s3.title": "构建与实验",
	"next.s3.body": "硬件 → 算法 → 系统",
	"next.s4.title": "真实场景验证",
	"next.s4.body": "农业环境与真实运行约束。",
	"next.s5.title": "智能农业无人机系统",
	"next.s5.body": "我希望走向的方向。",
	"journey.kicker": "档案",
	"journey.title": "完整项目档案",
	"journey.projects": "项目",
	"journey.projects.whisper": "从穿戴、AGV 到 RTK——串起路径的产品线。",
	"journey.companies": "公司",
	"journey.companies.whisper": "纵横、视源、摩尔——从硬件到现场交互。",
	"journey.make": "造物",
	"journey.make.whisper": "智能头盔与桌上 DIY——工作之外的交付。",
	"journey.society": "社会",
	"journey.society.whisper": "团队、校园与志愿——实验室之外的实践。",
	"journey.peek": "点击打开",
	"journey.brief": "详情",
	"journey.close": "关闭",
	"journey.end": "仍在路上——面向智能系统与低空技术。",
	"journey.end.sub": "旅程继续。",
	"journey.lightbox.hint": "滚轮缩放 · 点击外侧关闭",
	"exp.kicker": "经历",
	"exp.title": "我在哪里做",
	"exp.zongheng.role": "电子工程师",
	"exp.zongheng.company": "广州纵横智能科技",
	"exp.zongheng.tags": "机器人 · AGV · RTK · 嵌入式 · 电路",
	"exp.cvte.role": "PCB / 硬件工程",
	"exp.cvte.company": "视源电子 CVTE",
	"exp.cvte.tags": "Altium · 高速 · 阻抗 · SMT",
	"exp.moore.role": "交互 / 新媒体",
	"exp.moore.company": "深圳摩尔创展",
	"exp.moore.tags": "TouchDesigner · 传感 · 沉浸式",
	"skills.label": "技术",
	"skills.hardware": "硬件",
	"skills.embedded": "嵌入式",
	"skills.robotics": "机器人",
	"skills.ai": "人工智能",
	"skills.uav": "无人机 / 新兴",
	"contact.kicker": "联系",
	"contact.title": "一起把事情做实。",
	"contact.body":
		"欢迎交流电子、嵌入式、机器人、AI 硬件，以及智能农业无人机相关研究。",
	"contact.emailMe": "发邮件",
	"contact.connect": "连接",
	"contact.email": "邮箱",
	"contact.based": "所在地",
	"contact.location": "中国澳门",
	"contact.locationLabel": "所在地",
	"contact.city": "广东佛山",
	"contact.profiles": "主页",
	"lang.label": "语言",
};

const zhHant: Dict = {
	"nav.archive": "檔案",
	"story.01": "經歷",
	"story.02": "連接",
	"story.03": "目標",
	"story.04": "研究",
	"story.05": "下一步",
	"hero.role": "電子工程師",
	"hero.headline": "從硬體\n到智慧系統。",
	"hero.blurb":
		"我構建連接電子、嵌入式、機器人與人工智慧的系統。",
	"hero.chip.electronics": "電子",
	"hero.chip.embedded": "嵌入式",
	"hero.chip.robotics": "機器人",
	"hero.chip.ai": "人工智慧",
	"hero.scroll": "下滑",
	"core.kicker": "01 — 經歷",
	"core.title": "四個專案。\n四種能力。",
	"core.blurb":
		"四個不同的專案，逐漸塑造了我希望匯入同一系統的能力。",
	"core.open": "打開簡介",
	"core.rtk.title": "RTK 與農業感測",
	"core.rtk.cap": "精準定位",
	"core.rtk.body":
		"開發 RTK 定位與田間感測硬體，把精準定位與嵌入式、無線通訊連在一起。",
	"core.rtk.c1": "RTK",
	"core.rtk.c2": "GNSS",
	"core.rtk.c3": "LPWAN",
	"core.rtk.c4": "嵌入式",
	"core.agv.title": "工業 AGV",
	"core.agv.cap": "自主運行",
	"core.agv.body": "參與 AGV 控制、嵌入式系統與自主機器人運行。",
	"core.agv.c1": "機器人",
	"core.agv.c2": "ROS",
	"core.agv.c3": "運動控制",
	"core.fire.title": "邊緣 AI 火災預警",
	"core.fire.cap": "智慧感知",
	"core.fire.body":
		"構建結合電腦視覺、嵌入式計算與機器人控制的邊緣 AI 系統。",
	"core.fire.c1": "電腦視覺",
	"core.fire.c2": "Jetson",
	"core.fire.c3": "YOLO",
	"core.fire.c4": "ROS",
	"core.wear.title": "智慧穿戴",
	"core.wear.cap": "多感測系統",
	"core.wear.body":
		"把多感測、無線通訊與即時監測整合到同一套系統中。",
	"core.wear.c1": "感測",
	"core.wear.c2": "ESP32",
	"core.wear.c3": "BLE / Wi-Fi",
	"core.wear.c4": "IoT",
	"archive.kicker": "完整旅程",
	"archive.prompt": "專案 · 工作 · 實驗 · 活動",
	"archive.title": "完整旅程",
	"archive.cta": "查看完整專案檔案",
	"archive.back": "返回主敘事",
	"archive.page.blurb":
		"按時間線整理的工程旅程——公司、大學專案、造物與社會實踐。適合會後深入查看。",
	"conn.kicker": "02 — 連接",
	"conn.title": "不同經歷。\n同一系統。",
	"conn.statement":
		"這些經歷不是孤立專案，而是同一套系統的不同部分。",
	"conn.s1.from": "RTK",
	"conn.s1.to": "精準定位",
	"conn.s2.from": "AGV",
	"conn.s2.to": "自主",
	"conn.s3.from": "邊緣 AI",
	"conn.s3.to": "感知",
	"conn.s4.from": "感測 / 穿戴",
	"conn.s4.to": "即時感測",
	"conn.merge.kicker": "匯聚",
	"conn.merge.title": "系統整合",
	"conn.merge.goal": "智慧無人機系統",
	"goal.kicker": "03 — 目標",
	"goal.title": "智慧\n農業\n無人機系統",
	"goal.tagline": "從「會飛」到「能幹活」。",
	"goal.flow1": "定位",
	"goal.flow2": "感知",
	"goal.flow3": "決策",
	"goal.flow4": "執行",
	"research.kicker": "04 — 研究",
	"research.title": "我想探索什麼",
	"research.d1.title": "精準定位",
	"research.d1.tech": "RTK · GNSS · 多感測融合",
	"research.d2.title": "智慧感知",
	"research.d2.tech": "無人機感測 · 邊緣 AI · 電腦視覺",
	"research.d3.title": "自主作業",
	"research.d3.tech": "機器人 · 路徑規劃 · 運動控制",
	"research.d4.title": "空地協同",
	"research.d4.tech": "無人機 · 地面 IoT · AGV · 田間感測",
	"research.q.kicker": "我想探索的方向",
	"research.q.body":
		"無人機、精準定位、邊緣 AI 與地面感測系統，如何協同支撐自主農業作業？",
	"fit.kicker": "研究契合",
	"fit.blurb": "會議前用已核實的導師方向自訂——不要編造論文或成果。",
	"fit.mine": "我的經歷",
	"fit.yours": "導師研究",
	"fit.connect": "可能的連接",
	"next.kicker": "05 — 下一步",
	"next.title": "從工程\n到研究。",
	"next.s1.title": "打好基礎",
	"next.s1.body": "無人機 · 農業 · 定位 · 通訊",
	"next.s2.title": "找到研究問題",
	"next.s2.body": "與導師一起識別有意義的問題。",
	"next.s3.title": "構建與實驗",
	"next.s3.body": "硬體 → 演算法 → 系統",
	"next.s4.title": "真實場景驗證",
	"next.s4.body": "農業環境與真實運行約束。",
	"next.s5.title": "智慧農業無人機系統",
	"next.s5.body": "我希望走向的方向。",
	"journey.kicker": "檔案",
	"journey.title": "完整專案檔案",
	"journey.projects": "專案",
	"journey.projects.whisper": "從穿戴、AGV 到 RTK——串起路徑的產品線。",
	"journey.companies": "公司",
	"journey.companies.whisper": "縱橫、視源、摩爾——從硬體到現場互動。",
	"journey.make": "造物",
	"journey.make.whisper": "智慧頭盔與桌上 DIY——工作之外的交付。",
	"journey.society": "社會",
	"journey.society.whisper": "團隊、校園與志願——實驗室之外的實踐。",
	"journey.peek": "點擊打開",
	"journey.brief": "詳情",
	"journey.close": "關閉",
	"journey.end": "仍在路上——面向智慧系統與低空技術。",
	"journey.end.sub": "旅程繼續。",
	"journey.lightbox.hint": "滾輪縮放 · 點擊外側關閉",
	"exp.kicker": "經歷",
	"exp.title": "我在哪裡做",
	"exp.zongheng.role": "電子工程師",
	"exp.zongheng.company": "廣州縱橫智慧科技",
	"exp.zongheng.tags": "機器人 · AGV · RTK · 嵌入式 · 電路",
	"exp.cvte.role": "PCB / 硬體工程",
	"exp.cvte.company": "視源電子 CVTE",
	"exp.cvte.tags": "Altium · 高速 · 阻抗 · SMT",
	"exp.moore.role": "互動 / 新媒體",
	"exp.moore.company": "深圳摩爾創展",
	"exp.moore.tags": "TouchDesigner · 感測 · 沉浸式",
	"skills.label": "技術",
	"skills.hardware": "硬體",
	"skills.embedded": "嵌入式",
	"skills.robotics": "機器人",
	"skills.ai": "人工智慧",
	"skills.uav": "無人機 / 新興",
	"contact.kicker": "聯絡",
	"contact.title": "一起把事情做實。",
	"contact.body":
		"歡迎交流電子、嵌入式、機器人、AI 硬體，以及智慧農業無人機相關研究。",
	"contact.emailMe": "寄信給我",
	"contact.connect": "連接",
	"contact.email": "信箱",
	"contact.based": "所在地",
	"contact.location": "中國澳門",
	"contact.locationLabel": "所在地",
	"contact.city": "廣東佛山",
	"contact.profiles": "主頁",
	"lang.label": "語言",
};

const dictionaries: Record<Locale, Dict> = {
	en,
	"zh-Hans": zhHans,
	"zh-Hant": zhHant,
};

export const LOCALE_OPTIONS: { id: Locale; short: string; title: string }[] = [
	{ id: "en", short: "EN", title: "English" },
	{ id: "zh-Hant", short: "繁", title: "繁體中文" },
	{ id: "zh-Hans", short: "简", title: "简体中文" },
];

type LocaleContextValue = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: (key: string) => string;
	isZh: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
	if (typeof window === "undefined") return "en";
	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === "en" || stored === "zh-Hans" || stored === "zh-Hant") {
		return stored;
	}
	const lang = window.navigator.language.toLowerCase();
	if (lang.startsWith("zh")) {
		if (
			lang.includes("tw") ||
			lang.includes("hk") ||
			lang.includes("hant") ||
			lang.includes("mo")
		) {
			return "zh-Hant";
		}
		return "zh-Hans";
	}
	return "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>("en");
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setLocaleState(readStoredLocale());
		setReady(true);
	}, []);

	const setLocale = useCallback((next: Locale) => {
		setLocaleState(next);
		window.localStorage.setItem(STORAGE_KEY, next);
		document.documentElement.lang =
			next === "en" ? "en" : next === "zh-Hans" ? "zh-Hans" : "zh-Hant";
	}, []);

	useEffect(() => {
		if (!ready) return;
		document.documentElement.lang =
			locale === "en" ? "en" : locale === "zh-Hans" ? "zh-Hans" : "zh-Hant";
	}, [locale, ready]);

	const value = useMemo<LocaleContextValue>(() => {
		const dict = dictionaries[locale];
		return {
			locale,
			setLocale,
			t: (key: string) => dict[key] ?? dictionaries.en[key] ?? key,
			isZh: locale !== "en",
		};
	}, [locale, setLocale]);

	return (
		<LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
	);
}

export function useLocale() {
	const ctx = useContext(LocaleContext);
	if (!ctx) {
		throw new Error("useLocale must be used within LocaleProvider");
	}
	return ctx;
}
