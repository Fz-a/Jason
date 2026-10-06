/* eslint-disable */
/**
 * GENERATED FILE — do not edit.
 *
 * Source: content/terminal/<locale>/{content,recap,ui,theater}.md
 *         (see content/terminal/SPEC.md)
 * Rebuild: npm run content:build
 */

import type { Locale } from "../../lib/i18n";

export type TermChapter = {
	label: string;
	text: string;
	cmd: string;
	takeaway: string;
};

export type TermCopy = {
	header?: string;
	body?: string;
	footer?: string;
	hint?: string;
	rule?: string;
	cta?: string;
};

export type TermBlock =
	| { t: "items"; items: [string, string][] }
	| { t: "bars"; groups: { title: string; rows: [string, number, string][] }[] }
	| { t: "links"; links: { label: string; href: string; text: string }[] }
	| { t: "index"; rows: [string, string][] }
	| { t: "identity"; card: Record<string, string> }
	| { t: "note"; lines: string[] };

export type TermSection = { copy: TermCopy; blocks: TermBlock[] };

export type TermChapterDoc = {
	label: string;
	meta: Record<string, string>;
	nav: Record<string, string>;
	sections: TermSection[];
};

export type TermContent = {
	journey: TermChapter[];
	chapters: Record<string, TermChapterDoc>;
	settings: Record<string, string>;
	templates: Record<string, { body: string; args: string[] }>;
	raw: Record<string, unknown>;
};

const CONTENT: Record<Locale, TermContent> =
{
		"en": {
			"journey": [
				{
					"label": "01 · Who I am",
					"text": "Skip the technology words for a moment. Start from where I came from and what kind of problem I am trying to solve.",
					"cmd": "whoami",
					"takeaway": "Electronic Information Engineering → Embedded Hardware → Intelligent Systems → Low-Altitude"
				},
				{
					"label": "02 · What problem I solve",
					"text": "My capability reads as a chain: perceive reality → establish position → decide → act → work with people.",
					"cmd": "role",
					"takeaway": "Hardware → Embedded → Perception → Intelligence → Application"
				},
				{
					"label": "03 · Which projects prove it",
					"text": "No need for a long list of technologies. Four kinds of real projects show how the capability stacked up.",
					"cmd": "work",
					"takeaway": "Smart Wearable · RTK · AGV · Industrial Control"
				},
				{
					"label": "04 · Where my depth is",
					"text": "A tech stack is surface. What is worth expanding is which layers I can connect.",
					"cmd": "skills",
					"takeaway": "Electronics · Embedded · Localization · Perception · Control · Interaction"
				},
				{
					"label": "05 · Why low-altitude is next",
					"text": "This is not a change of track. It is putting accumulated capability into a more complex, more research-worthy system context.",
					"cmd": "path",
					"takeaway": "From Embedded Devices → Intelligent Unmanned Systems → Low-Altitude Applications"
				},
				{
					"label": "06 · Find me",
					"text": "If you care about intelligent hardware, RTK, robotics, UAVs or low-altitude applications, start from one concrete question.",
					"cmd": "contact",
					"takeaway": "Email · GitHub · Gitee · CSDN"
				}
			],
			"chapters": {
				"01": {
					"label": "Who I am",
					"meta": {
						"cmd": "whoami",
						"narration": "Skip the technology words for a moment. Start from where I came from and what kind of problem I am trying to solve.",
						"takeaway": "Electronic Information Engineering → Embedded Hardware → Intelligent Systems → Low-Altitude"
					},
					"nav": {},
					"sections": [
						{
							"copy": {},
							"blocks": [
								{
									"t": "identity",
									"card": {
										"name": "JASON CHEN",
										"title": "Electronic Information Engineer / Embedded & Intelligent Systems",
										"meta": "GPA 3.3/5.0 · Top 5% of major",
										"oneLine": "I started from circuits, PCB and MCU, and have gradually extended that into positioning, perception, robotics and AI interaction — with the next stage aimed at the low-altitude economy and intelligent unmanned systems."
									}
								}
							]
						},
						{
							"copy": {
								"header": "My core positioning",
								"body": "Connecting \"low-level electronic capability\" to \"real intelligent systems\".",
								"footer": "What I care about is not whether one module works, but whether hardware, software, perception, control and scenario close the loop."
							},
							"blocks": [
								{
									"t": "items",
									"items": [
										[
											"Starting point",
											"Electronic Information Engineering: electronics, control, embedded and hardware design"
										],
										[
											"Engineering",
											"PCB / MCU / power / sensors / communication: turning a circuit into a working device"
										],
										[
											"Systems",
											"RTK / AGV / vision / AI interaction: moving from a single board to many modules working together"
										],
										[
											"Next",
											"Unmanned aircraft and the low-altitude economy: moving positioning, perception and control into aerial systems"
										]
									]
								}
							]
						}
					]
				},
				"02": {
					"label": "What problem I solve",
					"meta": {
						"cmd": "role",
						"narration": "My capability reads as a chain: perceive reality → establish position → decide → act → work with people.",
						"takeaway": "Hardware → Embedded → Perception → Intelligence → Application"
					},
					"nav": {},
					"sections": [
						{
							"copy": {
								"header": "My technical loop",
								"footer": "What I am best at is not one tool but understanding, across layers, why an intelligent device runs at all."
							},
							"blocks": [
								{
									"t": "items",
									"items": [
										[
											"Hardware",
											"Schematics, PCB, MCU, power management, sensor and interface design"
										],
										[
											"Embedded",
											"C/C++, STM32 / ESP32, drivers, communication, MQTT, device control"
										],
										[
											"Perception",
											"RTK / GNSS, IMU, LiDAR, depth vision, OpenCV"
										],
										[
											"Interaction",
											"ASR, LLM, TTS, Web / App control and human-machine interaction"
										],
										[
											"System",
											"AGV, smart wearables, industrial remote control — multi-module integration and on-site debugging"
										]
									]
								}
							]
						},
						{
							"copy": {
								"header": "How I look at a system",
								"body": "What is the input? Is the position and state trustworthy? What is the decision based on? Is the execution stable? Can a person understand and control it?",
								"footer": "That is also why I am moving from electronic engineering toward intelligent unmanned systems: the problem stopped being a single component and became a system-level loop."
							},
							"blocks": []
						}
					]
				},
				"03": {
					"label": "Which projects prove it",
					"meta": {
						"cmd": "work",
						"narration": "No need for a long list of technologies. Four kinds of real projects show how the capability stacked up.",
						"takeaway": "Smart Wearable · RTK · AGV · Industrial Control"
					},
					"nav": {},
					"sections": [
						{
							"copy": {
								"header": "Projects are evidence, not a display case",
								"footer": "Each project solves a different problem, but all of them train the same thing: making an intelligent system work under real constraints."
							},
							"blocks": [
								{
									"t": "items",
									"items": [
										[
											"Smart wearable for the elderly",
											"Built for 60+ users, combining heart-rate / respiration / temperature monitoring, fall detection, smoke detection and voice interaction; trained sensing, embedded, AI interaction and cross-disciplinary system design"
										],
										[
											"BeiDou RTK for agricultural machinery",
											"Took part in a high-precision positioning terminal and its field application; it moved me from \"a positioning module\" to understanding how GNSS / RTK behave in real working environments"
										],
										[
											"AGV intelligent mobile system",
											"Fused LiDAR, depth vision, sound localization, autonomous navigation and remote control; owned the AI interaction and control systems, and first touched the perception-decision-action chain"
										],
										[
											"VXS-100 / industrial remote control",
											"Covered MCU, BMS, MIC, PA, DC-DC / LDO modules; trained system thinking from circuit design through to whole-machine control"
										],
										[
											"Training vehicle / robot",
											"MCU, PID, motor control and whole-vehicle debugging; built my grasp of the relationship between control loops, tuning and actual motion"
										]
									]
								}
							]
						},
						{
							"copy": {
								"header": "The real progression between the projects",
								"body": "The smart wearable taught me to perceive a person → RTK taught me to establish position → AGV taught me to perceive an environment and move → industrial equipment taught me to execute reliably.",
								"footer": "The next question follows naturally: put these capabilities in the air, and you face three-dimensional trajectories, dynamic obstacles, weather, communication links and safety constraints."
							},
							"blocks": []
						}
					]
				},
				"04": {
					"label": "Where my depth is",
					"meta": {
						"cmd": "skills",
						"narration": "A tech stack is surface. What is worth expanding is which layers I can connect.",
						"takeaway": "Electronics · Embedded · Localization · Perception · Control · Interaction"
					},
					"nav": {},
					"sections": [
						{
							"copy": {
								"header": "Six-layer technical structure",
								"footer": "My strength is \"horizontal connection plus an embedded core\": understanding perception, control and AI interaction from the PCB / MCU upward."
							},
							"blocks": [
								{
									"t": "bars",
									"groups": [
										{
											"title": "01 Hardware",
											"rows": [
												[
													"hardware",
													9,
													"Schematics · PCB Layout · Altium · MCU · Power · Sensors · Interfaces"
												]
											]
										},
										{
											"title": "02 Embedded",
											"rows": [
												[
													"embedded",
													9,
													"C/C++ · STM32 · ESP32 · Drivers · UART / CAN · MQTT"
												]
											]
										},
										{
											"title": "03 Localization",
											"rows": [
												[
													"localization",
													8,
													"GNSS · BeiDou RTK · Positioning terminals · Field deployment"
												]
											]
										},
										{
											"title": "04 Perception",
											"rows": [
												[
													"perception",
													8,
													"LiDAR · Depth vision · IMU · OpenCV · Multi-sensor applications"
												]
											]
										},
										{
											"title": "05 Control",
											"rows": [
												[
													"control",
													8,
													"PID · Motor control · AGV · Motion-system debugging"
												]
											]
										},
										{
											"title": "06 Interaction",
											"rows": [
												[
													"interaction",
													8,
													"ASR · LLM · TTS · Web / App · AI interaction"
												]
											]
										}
									]
								}
							]
						},
						{
							"copy": {
								"header": "What \"depth\" means here",
								"body": "Hardware decides what a device can sense; embedded decides how it works in real time; positioning and perception decide how the system knows its environment; control decides how it acts; interaction decides how people take part.",
								"footer": "These five layers are not separate skills — they are the technical base I want to keep integrating toward intelligent unmanned systems."
							},
							"blocks": []
						}
					]
				},
				"05": {
					"label": "Why low-altitude is next",
					"meta": {
						"cmd": "path",
						"narration": "This is not a change of track. It is putting accumulated capability into a more complex, more research-worthy system context.",
						"takeaway": "From Embedded Devices → Intelligent Unmanned Systems → Low-Altitude Applications"
					},
					"nav": {},
					"sections": [
						{
							"copy": {
								"header": "My migration logic",
								"footer": "I want to move from \"I can build devices\" toward \"I understand how unmanned systems run safely, intelligently and at scale\"."
							},
							"blocks": [
								{
									"t": "items",
									"items": [
										[
											"Existing base",
											"PCB, MCU, sensors, power, communication and embedded systems"
										],
										[
											"Existing transfer",
											"RTK → high-precision positioning; AGV → autonomous movement; vision / LiDAR → environmental perception; AI interaction → human-machine coordination"
										],
										[
											"New problems",
											"Unmanned aircraft must also face 3D trajectories, dynamic obstacles, weather, communication, airspace and safety constraints"
										],
										[
											"Research direction",
											"Intelligent unmanned systems, UAV applications, low-altitude perception and positioning, low-altitude technology in practice"
										],
										[
											"Long-term goal",
											"Move from engineering implementation into technical planning, product design and industrial adoption for low-altitude systems"
										]
									]
								}
							]
						},
						{
							"copy": {
								"header": "The problem I actually want to research",
								"body": "How do you organize positioning, perception, control and scenario demand into one reliable low-altitude intelligent system — instead of just building \"a thing that flies\"?",
								"footer": "That is the core reason I chose low-altitude economy and technology as my next direction of study."
							},
							"blocks": []
						}
					]
				},
				"06": {
					"label": "Find me",
					"meta": {
						"cmd": "contact",
						"narration": "If you care about intelligent hardware, RTK, robotics, UAVs or low-altitude applications, start from one concrete question.",
						"takeaway": "Email · GitHub · Gitee · CSDN"
					},
					"nav": {},
					"sections": [
						{
							"copy": {
								"header": "Contact Jason",
								"hint": "Technical exchange · Project collaboration · Research direction · Intelligent unmanned systems"
							},
							"blocks": [
								{
									"t": "links",
									"links": [
										{
											"label": "email",
											"href": "mailto:1106467336@qq.com",
											"text": "1106467336@qq.com"
										},
										{
											"label": "github",
											"href": "https://github.com/Fz-a",
											"text": "github.com/Fz-a"
										},
										{
											"label": "gitee",
											"href": "https://gitee.com/Fz_z",
											"text": "gitee.com/Fz_z"
										},
										{
											"label": "csdn",
											"href": "https://blog.csdn.net/Fz_a",
											"text": "blog.csdn.net/Fz_a"
										}
									]
								}
							]
						}
					]
				},
				"07": {
					"label": "Recap",
					"meta": {
						"cmd": "summary",
						"narration": "No repeating the six chapters — just the one thread worth remembering.",
						"takeaway": "Starting from electronic information engineering, I have gradually connected embedded hardware capability to positioning, perception, robotics and low-altitude intelligent systems."
					},
					"nav": {
						"navTitle": "Engineering path",
						"navSubtitle": "six questions, one thread",
						"navNotStarted": "Starting from hardware — where am I heading?"
					},
					"sections": [
						{
							"copy": {
								"header": "JASON CHEN · ENGINEERING PATH",
								"rule": "Electronics → Embedded → Localization → Perception → Intelligent Systems → Low-Altitude Applications",
								"cta": "Want to go deeper? Run work for projects, skills for the technical structure, path for the next stage."
							},
							"blocks": [
								{
									"t": "index",
									"rows": [
										[
											"01",
											"Who I am: electronic information engineering, focused on embedded and intelligent systems"
										],
										[
											"02",
											"What I solve: connecting hardware, embedded, perception and interaction into systems"
										],
										[
											"03",
											"What I shipped: smart wearable · RTK · AGV · industrial remote control"
										],
										[
											"04",
											"My depth: Hardware · Embedded · Localization · Perception · Control · Interaction"
										],
										[
											"05",
											"Why low-altitude: existing capability transfers naturally to UAVs and unmanned systems"
										],
										[
											"06",
											"Find me: Email · GitHub · Gitee · CSDN"
										]
									]
								}
							]
						},
						{
							"copy": {
								"header": "One sentence to remember me by",
								"body": "I did not start from \"unmanned aircraft\" — I started from electronics and embedded, and I am now moving that engineering capability into low-altitude intelligent systems."
							},
							"blocks": []
						}
					]
				}
			},
			"settings": {
				"pressEnterToContinue": "⏎ press Enter to continue",
				"orTypeACommand": "or type a command · help",
				"inputPlaceholder": "type a command, e.g. summary",
				"guidedTour": "Engineering path",
				"btnRun": "Open",
				"btnNext": "Next chapter",
				"welcomeLine1": "Welcome. I am Jason Chen, an engineer moving from electronic information engineering toward intelligent unmanned systems.",
				"welcomeLine2a": "press ",
				"welcomeLine2b": " to begin — six questions that map my technical path.",
				"advancing": "opening the next layer…",
				"restarting": "back at the start.",
				"tourDoneA": "★ Path complete: Hardware → Embedded → Localization → Perception → Intelligent Systems → Low-Altitude.",
				"tourDoneB": "want the quick version?",
				"tourDoneCmd": "summary",
				"tourDoneC": ". Want the projects, run work.",
				"tourDoneD": "",
				"manualHeader": "Quick entries",
				"manualEgg": "no need to memorize commands — these entries are enough.",
				"catUsage": "usage: cat <file>",
				"didYouMean": "did you mean ",
				"tryHelp": "(try: help)",
				"pythonLine1": "engineering tools are the means; the system problem is the point.",
				"pythonLine2": "(hardware first · system thinking)",
				"sudoSandwich": "okay.",
				"sudoDenied": "get the system stable first, then talk about sudo.",
				"rmReply": "you do not delete experience, only redundancy.",
				"exitLine1": "there is no complicated menu here. try ",
				"exitLine2": ".",
				"helloLine1": "hello. type ",
				"helloLine2": " to start.",
				"xyzzyReply": "a hollow voice says: keep the system complete.",
				"fortyTwoReply": "the answer is rarely in the tool — it is in the real scenario.",
				"unameLine": "JasonOS-portfolio · Embedded · RTK · Robotics · Low-Altitude",
				"topHeader": "LAYER  COMMAND  STATUS",
				"uptimeLine1": "Electronic Information Engineering → Embedded Systems",
				"uptimeLine2": "Current focus: Intelligent Unmanned Systems / Low-Altitude",
				"pingLost": "4 transmitted, 4 received, 0% packet loss",
				"gitUsage": "usage: git log | git status",
				"gitStatusNothing": "working tree clean: keep building.",
				"gitStatusShip": "(systems thinking over tool-stacking)",
				"matrixWake": "wake up, Neo… (any key to exit)",
				"konamiLine": "KONAMI ACCEPTED — SYSTEM THINKING MODE",
				"galleryHeader": "PROJECT PATH — click to open",
				"dragonCaption": "Hardware → Embedded",
				"rocketCaption": "Perception → Low-Altitude",
				"bootTitle": "JasonOS — engineering portfolio",
				"emailLabel": "email",
				"hackNote_a": "  nothing to crack here. run ",
				"hackNote_intro": " for my technical path",
				"hackNote_art": " for the project evolution",
				"hackNote_end": "."
			},
			"templates": {
				"themeSet": {
					"body": "theme set to {next}",
					"args": [
						"next"
					]
				},
				"eggPrefix": {
					"body": "easter egg {n}/{total} — {label}",
					"args": [
						"n",
						"total",
						"label"
					]
				},
				"gitStatusClean": {
					"body": "on branch {branch}",
					"args": [
						"branch"
					]
				},
				"pingStats": {
					"body": "--- {host} ping statistics ---",
					"args": [
						"host"
					]
				},
				"pingHeader": {
					"body": "PING {host} 56(84) bytes of data.",
					"args": [
						"host"
					]
				},
				"cmdNotFound": {
					"body": "command not found: {cmd}",
					"args": [
						"cmd"
					]
				},
				"catNoFile": {
					"body": "cat: {arg}: no such file (try: about.txt, skills.txt, contact.txt)",
					"args": [
						"arg"
					]
				},
				"manNoEntry": {
					"body": "no manual entry for {arg}",
					"args": [
						"arg"
					]
				},
				"editorReply": {
					"body": "{cmd}: this portfolio stays read-only.",
					"args": [
						"cmd"
					]
				}
			},
			"raw": {
				"manual": [
					[
						"next / skip",
						"next chapter",
						"next"
					],
					[
						"restart",
						"back to chapter one",
						"restart"
					],
					[
						"summary",
						"my technical path in 10 seconds",
						"summary"
					],
					[
						"work",
						"real projects and capability evidence",
						"work"
					],
					[
						"skills",
						"the six-layer technical structure",
						"skills"
					],
					[
						"path",
						"why low-altitude is the next step",
						"path"
					],
					[
						"whoami / about",
						"my background and positioning",
						"about"
					],
					[
						"role",
						"what kind of problem I solve",
						"role"
					],
					[
						"contact",
						"contact details",
						"contact"
					],
					[
						"neofetch",
						"technical identity",
						"neofetch"
					],
					[
						"git log",
						"project evolution timeline",
						"git log"
					],
					[
						"art",
						"project direction gallery",
						"art"
					],
					[
						"hack",
						"engineer easter-egg mode",
						"hack"
					],
					[
						"theme",
						"toggle theme",
						"theme"
					],
					[
						"cat <file>",
						"about.txt · skills.txt · contact.txt",
						"cat about.txt"
					],
					[
						"ping <host>",
						"network easter egg",
						"ping"
					],
					[
						"fortune",
						"engineer quotes",
						"fortune"
					],
					[
						"history",
						"command history",
						"history"
					],
					[
						"man <cmd>",
						"manual pages",
						"man tour"
					],
					[
						"help",
						"quick entries",
						"help"
					],
					[
						"clear",
						"wipe the screen",
						"clear"
					]
				],
				"bootLog": [
					"[    0.000000] Jason portfolio booting...",
					"[    0.000421] identity    : Electronic Information Engineering",
					"[    0.001024] hardware    : PCB / MCU / Power / Sensors",
					"[    0.002048] embedded    : C/C++ / STM32 / ESP32",
					"[    0.003145] localization: GNSS / RTK",
					"[    0.004096] perception  : LiDAR / Vision / IMU",
					"[    0.005512] control     : PID / AGV / Motion",
					"[    0.006331] interaction : ASR / LLM / TTS",
					"[    0.007222] next_stage  : Intelligent Unmanned Systems",
					"[  OK  ] system initialized."
				],
				"neofetchInfo": [
					[
						"OS",
						"Jason Portfolio"
					],
					[
						"Role",
						"Electronic Engineer / Embedded Systems"
					],
					[
						"Education",
						"Electronic Information Engineering"
					],
					[
						"Academic",
						"GPA 3.3/5.0 · Major Top 5%"
					],
					[
						"Core",
						"Hardware · Embedded · RTK · Perception · Control"
					],
					[
						"Direction",
						"Intelligent Unmanned Systems / Low-Altitude Applications"
					]
				],
				"gitLog": [
					"* direction: low-altitude intelligent systems",
					"* system: AGV — LiDAR / depth vision / sound localization / AI interaction",
					"* positioning: RTK — high-precision localization application",
					"* device: VXS-100 — MCU / BMS / audio / power management",
					"* device: smart wearable — sensing / fall detection / voice interaction",
					"* control: training vehicle — PID / motor control / system debugging"
				],
				"gitStatus": [
					"  branch: low-altitude",
					"  status: learning + building",
					"  architecture: hardware → embedded → perception → intelligence",
					"  next: research · engineering · application"
				],
				"gallery": [
					[
						"hardware",
						"starting from the circuit board"
					],
					[
						"rtk",
						"understanding a system through position"
					],
					[
						"agv",
						"from perceiving the environment to moving"
					],
					[
						"ai",
						"from device control to human-machine coordination"
					],
					[
						"drone",
						"from ground intelligence to low-altitude intelligence"
					]
				],
				"fortunes": [
					"\"A device working does not mean a system has been established.\"",
					"\"Position, perception, control and scenario must close the loop.\"",
					"\"Real engineering ability is taking a complex system apart, then reconnecting it.\"",
					"\"From building one device, to understanding one unmanned system.\""
				]
			}
		}
	} as unknown as Record<Locale, TermContent>;

export function getTermContent(locale: Locale): TermContent {
	return CONTENT[locale] ?? CONTENT.en;
}

export default CONTENT;
