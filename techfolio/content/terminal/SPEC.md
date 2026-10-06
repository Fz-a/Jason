# 终端内容源文件规范 v2

> 这个目录是**终端 CLI 展示内容的唯一真源**。你（作者）只改这里的 `.md`，
> 改完运行 `npm run content:build`，构建脚本会把它编译成终端读取的数据文件。
> 你不需要碰任何 `.tsx`。

---

## 0. 两层结构：分区 → 章节

终端的全部文案只有 **4 个分区**，每个分区 1 个文件。站点只有英文一种语言，
所以只有一套目录：

```
content/terminal/
  SPEC.md              ← 你正在读的这份规范
  README.md            ← 给作者看的速查
  en/                  英文（唯一语言）
    content.md         分区 1 · 引导之旅的六章
    recap.md           分区 2 · 走完之后的速览页
    ui.md              分区 3 · 界面文案（按钮 / 提示 / 命令表）
    theater.md         分区 4 · 装饰（开机动画 / ASCII 画廊）
```

**分区（zone）= 这段文字是什么性质。** 由文件名决定，front-matter 里的
`zone:` 只是自检用的声明，必须和文件名一致。

| 分区 | 回答的问题 | 有章节吗 | 删掉会怎样 |
|------|-----------|---------|-----------|
| `content` | 我是谁 / 我解决什么问题 / 哪些项目证明 / 技术纵深 / 为什么低空 / 找我 | 有，01–06 | 终端没内容可展示 |
| `recap` | 走完之后一屏回顾 + 左侧导航标题 | 有，07 | 走完了没总结 |
| `ui` | 按钮、输入框占位字、命令手册、带变量的回复 | 无 | 界面全是英文常量 |
| `theater` | 开机日志、neofetch、提交历史、ASCII 画廊 | 无 | 少了彩蛋，不影响信息 |

**章节（chapter）= content / recap 分区里的一个 `## NN · 标题`。**
编号决定左侧导航的序号、进度 `3/6`、章节横幅 `══ 02 ...`。

```
content.md                        recap.md
  ## 01 · 我是谁        ← 01 章       ## 07 · 速览   ← 07 章
  ## 02 · 我解决什么问题            recapRule
  ## 03 · 哪些项目证明了这一点      recapCta
  ## 04 · 我的技术纵深在哪里
  ## 05 · 为什么下一步是低空经济
  ## 06 · 找我
```

**一章可以有很多「小节」（section）** —— 每个 `field` 块开启一个，
用来「说一段 → 给证据 → 再说更深的一段」。详见 §2.1。

**铁律**

1. **`en/` 必须恰好有 4 个文件**，名字与四个分区一一对应，
   `content:check` 会报出缺哪个、多哪个。
2. **`zone:` 必须和文件名一致。** 写了 `zone: ui` 却在 `content.md` 里 → 报错。
3. **`content` 的章节编号必须从 01 开始连续递增。** 不能跳号、不能重排、
   不能把 07 写进 `content.md`。编号集合是固定的 01–07（构建脚本登记的）。
4. **未知块类型 = 构建失败。** 宁可报错，也不要静默忽略。
5. **正文里不许有游离文字。** 内容必须在三反引号块里，或在章节标题下。
6. **ASCII 大画（佛像 / 冯·诺依曼 / 龙 / 火箭）在 `app/components/terminal/`，**
   是纯装饰，不需要你维护。

---

## 1. front-matter（必需）

每个文件的第一段是 front-matter，**只有一个字段**：

````markdown
---
zone: content
---
````

`zone` 必须是 `content` / `recap` / `ui` / `theater` 之一，且等于文件名去掉 `.md`。

**文件正文里可以用 HTML 注释写给自己看的话**，注释内容会被完全忽略：

````markdown
<!--
  这段不会出现在页面上，也不会被校验。
  可以写多行。
-->
````

---

## 2. 章节（只在 `content` / `recap` 分区）

一个章节 = **一个 `## NN · 标题` 标题 + 三行元信息 + 一个或多个「小节」**。

### 2.1 小节（section）—— 本规范的核心

**每个 `field` 块开启一个小节。** 跟在它后面的所有内容块都属于这个小节，
直到下一个 `field` 块出现。

一个小节 = `field` 里的三行文案 + 它下面的内容块，渲染顺序固定：

```
header  →  body  →  内容块（按写的顺序）  →  footer
```

这样一章可以「说一段 → 给证据 → 再说更深的一段」重复任意多次，
而**不需要任何代码改动**。想要一个新的论点，就多写一个 `field` 块。

````markdown
## 02 · 我解决什么问题

cmd: role
narration: ...
takeaway: ...

```field
header = 我的技术闭环
footer = 我最擅长的不是某一个工具，而是跨层理解一个智能设备为什么能运行。
```

```numbered
1. Hardware | 原理图、PCB、MCU ...
2. Embedded | C/C++、STM32 / ESP32 ...
```

```field
header = 我看一个系统的方式
body = 输入是什么？位置和状态是否可信？
footer = 这也是我走向智能无人系统的原因。
```
````

上面这一章会渲染成：标题 → 五条能力 → 第一段结论 → 第二段小标题 → 追问 → 第二段结论。

### 2.2 标题与元信息

| 字段 | 规则 |
|------|------|
| 标题 | 格式固定 `## NN · 标题`。`NN` 是两位数字，就是章节号 |
| `cmd` | 命令名，小写无空格。必须是终端已实现的命令（§6 清单） |
| `narration` | 章节开始时打印的引导语。**不要重复标题** |
| `takeaway` | 章节结束后以 `└─ ` 开头打印的结论。这章唯一需要记住的那句 |

- 三行元信息**必须紧跟在标题后面**，且在第一个代码块之前。
- 元信息里多余的键 → **报错**（防止你以为改了但没生效）。
- 一章**至少要有一个内容块**，校验器会检查。

**校验错误示例**

```
✗ content/terminal/en/content.md
  · 第 24 行：第 02 章缺少必填元信息 "takeaway"
  · 第 12 行：第 02 章的 cmd "rol" 不是已实现的命令
  · 第 31 行：章节 02 重复定义
  · 第 40 行：块必须放在某个 `## NN · 标题` 章节下面，这一行游离在外面：随便写点什么
```

---

## 3. 内容块

内容块是三反引号围栏，**围栏的语言标签就是块类型**。

### 3.1 `numbered` —— 编号条目（只用在 `content`）

用于有序清单。**在小节里渲染成 `1.` `2.` 样式**，标题加粗高亮，详情另起一行缩进。

````
```numbered
1. Hardware | 原理图 · PCB Layout · 器件选型 · 打样焊接
2. Embedded | C/C++ · STM32 驱动 · FreeRTOS · 通信协议
```
````

- 序号 `1.` `2.` … 必须连续递增。
- `|` 分隔**标题**和**详情**，两侧空格可有可无。
- 详情里**禁止出现 `|`**。要用分隔符请用 `·`。
- 同一个块里不要混用两种分隔符。

### 3.2 `items` —— 标签 + 说明（只用在 `content`）

用于项目清单、时间线。**在小节里渲染成 `▸` 样式**，标题高亮，说明灰色缩进。

````
```items
农机北斗 RTK 终端 | 为农机做高精度定位，批量交付后机器持续在线作业
AGV 智能移动系统 | 融合 LiDAR、深度视觉、自主导航与远程控制
```
````

- `|` 前是标题（高亮），后是说明（灰色）。
- 不写 `|` 也可以（则整行都算标题）。但**建议写全**，这是给读者看的重点。
- 和 `numbered` 一样会被编译进当前小节。

### 3.3 `bars` —— 能力条（按组，只用在 `content`）

用于「会什么」。

````
```bars
group: 嵌入式 / 硬件
embedded | 9 | C/C++ · STM32 · PCB bring-up · 传感集成
rtk/gnss | 8 | 北斗 RTK · GNSS 解算 · LPWAN 现场部署
group: 控制 / 算法
control | 9 | PID 整定 · 运动控制 · 循迹与 AGV
```
````

- `group: X` 开启一个新组，组名用强调色渲染。
- 组内每行 `名称 | 等级 | 说明`。
- **等级必须是 1–10 的整数**，超范围直接报错。10 格条会渲染成 `##########`。
- 第一个 `group:` 之前不能有任何条目行。
- **可以写多个 `bars` 块**，相邻的会**自动合并**成一组。
  想加一组能力就新开一个块，最清爽。

### 3.4 `identity` —— 身份卡（只用在 `content` 的 01 章）

````
```identity
name: JASON CHEN
title: 电子工程师 / 嵌入式硬件
meta: 中国广州 · 4 年+
oneLine: 我设计并交付能真正跑起来的硬件：从原理图、PCB、固写到整机量产。
```
````

四个字段全部必填。`name` 加粗大字距，`title` 高亮，`meta` 变淡，`oneLine` 正常。

### 3.5 `links` —— 联系方式（只用在 `content` 的 06 章）

````
```links
邮箱     | mailto:1106467336@qq.com | 1106467336@qq.com
github   | https://github.com/Fz-a   | github.com/Fz-a
gitee    | https://gitee.com/Fz_z    | gitee.com/Fz_z
csdn     | https://blog.csdn.net/Fz_a | blog.csdn.net/Fz_a
```
````

三列：`显示名 | 真实链接 | 展示文本`。`mailto:` 开头的链接在页面上不打开新标签页。

### 3.6 `index` —— 章节索引表（只用在 `recap`）

````
```index
01 | 我是谁：电子工程师，做落地硬件
02 | 我做什么：设计 → 固件 → 调优 → 交付
```
````

两列，行数应和 `content` 的章节数一致。

### 3.7 `note` —— 段落说明（`content` / `recap`）

自由文本，按原样渲染成普通行，不加粗。多数情况下你不需要它 ——
章节的开场白用 `narration`，结论用 `takeaway`。

````
```note
关键点：我不是只写代码或只画板子 —— 一件产品我从头跟到尾。
```
````

### 3.8 `field` —— 小节文案（`content` / `recap`）

`键 = 值`，每行一条。**每个 `field` 块开启一个小节**，见 §2.1。

````
```field
header = 我的技术闭环
body = 把“底层电子能力”连接到“真实智能系统”。
footer = 我关心的不只是一个模块能不能工作，而是硬件、软件、感知、控制与场景能不能形成闭环。
```
````

| 键 | 位置 | 含义 |
|----|------|------|
| `header` | 小节开头 | 这段要说什么（加粗高亮） |
| `body` | header 之后 | 展开一句，正常亮度 |
| `footer` | 内容块之后 | 这段的结论（淡一点） |
| `hint` | 小节末尾 | 联系方式下面的补充说明 |
| `rule` | 小节末尾 | 回顾页那句加粗的总结 |
| `cta` | 小节末尾 | 总结下面那句行动号召 |
| `navTitle` | 回顾章 | 左侧导航的标题 |
| `navSubtitle` | 回顾章 | 导航标题下面那行小字 |
| `navNotStarted` | 回顾章 | 还没开始时导航底部显示的话 |

渲染顺序：`header` → `body` → 内容块 → `footer` → `hint` / `rule` / `cta`。

- 三个 `nav*` 键**不属于小节**，它们是左侧导航的文案，写在哪一节都行。
- 写了表外的键 → **报错**（防止你以为改了但没生效）。
- 一个 `field` 块里同一个键不能写两次。

### 3.9 `settings` —— 界面文案（只用在 `ui`）

`键 = 值`，每行一条。改这里能改终端里所有零散的界面文字。

````
```settings
inputPlaceholder = or type a command, e.g. help
manualHeader = available commands — click any of them:
tourDoneB = "want it on one screen? "
```
````

- 键必须与终端读取的字段名一致，**写错的键会报错**。
- 值为空字符串是合法的（会隐藏该元素）。
- **可以写多个 `settings` 块**，同键会覆盖，想分组就分段写。
- **前导/尾随空格必须加引号**才能保住，见 §5.2。

键按用途分组（全部列在 §3.9 附表里，实际可用键共 60 个）：
`pressEnterToContinue` `orTypeACommand` `inputPlaceholder` `guidedTour`
`btnRun` `btnNext` `navTitle` `navSubtitle` `navNotStarted`
`welcomeLine1` `welcomeLine2a` `welcomeLine2b`
`advancing` `restarting` `tourDoneA` `tourDoneB` `tourDoneCmd` `tourDoneC`
`tourDoneD`
`manualHeader` `manualEgg`
`catUsage` `didYouMean` `tryHelp` `pythonLine1` `pythonLine2` `sudoSandwich`
`sudoDenied` `rmReply` `exitLine1` `exitLine2` `helloLine1` `helloLine2`
`xyzzyReply` `fortyTwoReply` `unameLine` `topHeader` `uptimeLine1`
`uptimeLine2` `pingLost` `gitUsage` `gitStatusNothing` `gitStatusShip`
`matrixWake` `konamiLine` `galleryHeader` `dragonCaption` `rocketCaption`
`bootTitle` `emailLabel`
`hackNote_a` `hackNote_intro` `hackNote_art` `hackNote_end`

### 3.10 `template` —— 带变量的文案（只用在 `ui`）

`键(参数...) = 值`。终端会把它编译成真正的函数，运行时替换 `{占位符}`。

````
```template
themeSet(next) = 荧光已切换为 {next} —— 再运行一次切回
cmdNotFound(cmd) = 命令未找到: {cmd}
```
````

- 写法固定：`键(参数1, 参数2) = 值`，**参数签名必须显式写出来**。
- 可用的键只有这 9 个（参数名和顺序固定，写错就报错）：

  | 键 | 参数 |
  |----|------|
  | `themeSet` | `next` |
  | `eggPrefix` | `n, total, label` |
  | `gitStatusClean` | `branch` |
  | `pingStats` | `host` |
  | `pingHeader` | `host` |
  | `cmdNotFound` | `cmd` |
  | `catNoFile` | `arg` |
  | `manNoEntry` | `arg` |
  | `editorReply` | `cmd` |

- 值里的 `{name}` **必须**是签名里声明过的参数；出现未声明的占位符 → 报错。
- 签名里声明了但值里没用到的参数 → 报错（通常是打错了名字）。
- 值里可以用 `|`（这里不是分隔符）。

### 3.11 `cmds` —— 命令手册表（只用在 `ui`）

三列：`命令 | 说明 | 实际执行的命令`。

````
```cmds
next / skip | advance the guided tour one chapter | next
role        | what I actually do — four parts        | role
git log     | commit history of a career              | git log
```
````

- 第三列的**第一个词**必须是终端已实现的命令（可以带参数），否则报错。
- 第一列是给人看的，可以写别名，用 ` / ` 分隔。
- 显示时按第一列宽度对齐。

### 3.12 `raw` —— 多行原文（只用在 `theater`）

用于开机滚动日志、提交历史这类「一整块原样打印」的内容。

````
```raw bootLog
[    0.000000] JasonOS 2.6.10 booting on portfolio-cpu0
[    0.000421] CPU: curiosity @ 5.15GHz (8 cores, 1 brain)
```
````

- 围栏标签后面跟一个**字段名**（如 `bootLog`），编译后可用 `T.bootLog` 读到数组。
- 块内**原样保留**，空行保留（用于日志里的段落间隔）。
- 不支持 `|`，也不做任何转义 —— 需要分隔符的用别的块类型。
- `raw` 的可用字段名：`bootLog` `gitLog` `gitStatus` `hackLines` `fortunes`。

### 3.13 `pairs` —— 二列键值（只用在 `theater`）

用于 `neofetch` 的系统信息表和 ASCII 画廊索引。

````
```pairs neofetchInfo
OS | JasonOS 2.6.10 portfolio x86_64
Host | Guangzhou, China
```

```pairs gallery
buddha | zen, in monospace
```
````

- 围栏标签后面跟一个**字段名**，编译后可用 `T.neofetchInfo` 读到二维数组。
- 必须正好两列。
- 可用字段名：`neofetchInfo` `gallery`。

### 3.14 `trio` —— 三列数据（只用在 `theater`）

`pairs` 的三列版本，编译后每行是 `[a, b, c]`。写两列时第三列自动补空字符串。

---

## 4. 块类型归属一览

一个块类型只能出现在指定的分区，写错了直接报错。

| 块类型 | content | recap | ui | theater |
|--------|:-------:|:-----:|:--:|:-------:|
| `identity` | 01 | | | |
| `numbered` | ✓ | | | |
| `items` | ✓ | | | |
| `bars` | ✓ | | | |
| `links` | 06 | | | |
| `field` | ✓ | ✓ | | |
| `note` | ✓ | ✓ | | |
| `index` | | ✓ | | |
| `settings` | | | ✓ | |
| `template` | | | ✓ | |
| `cmds` | | | ✓ | |
| `raw` | | | | ✓ |
| `pairs` | | | | ✓ |
| `trio` | | | | ✓ |

---

## 5. 通用规则

### 5.1 特殊字符

| 字符 | 为什么 | 替代 |
|------|--------|------|
| `\|` | `numbered`/`items`/`bars`/`links`/`index`/`cmds`/`pairs` 的字段分隔符 | 用 `·` |
| 裸换行（在 front-matter 或章节元信息里） | 那两处是单行格式 | 用内容块 |
| 制表符 | 渲染宽度不可控 | 用两个空格 |

`field` / `settings` / `template` / `raw` 用 `=` 或整块保留，所以值里可以自由出现 `|`。

### 5.2 空格与引号（重要）

有几条文案是「前缀」——后面会紧跟一个可点击的命令名，比如
`didYouMean = did you mean ` 后面接高亮的 `skills`。这类**尾随空格必须保住**。

规则：

- **不加引号** → 尾随空格会被自动去掉（避免误存看不见的空白）。
- **加引号** → 引号内的一切原样保留，包括首尾空格。

引号可以用 `"` 或 `'`。**值本身含 `"` 时用 `'`**；含 `'` 时用 `"`（更常见）。

````
```settings
didYouMean = did you mean          ← 尾随空格被去掉，拼接时会粘住
didYouMean = "did you mean "       ← 尾随空格保留 ✓
didYouMean = 'from "who I am" '    ← 值里有双引号，用单引号包 ✓
```
````

`raw` 块**永远原样保留**，包括空格和空行，不需要引号。

### 5.3 怎么加一个新块类型（扩展方式）

块类型是**开放注册**的——写错的类型名会直接报错，不会被静默忽略。
但要真正生效需要两步：

1. 在本规范 §3 里补一条说明。
2. 在 `scripts/build-terminal-content.mjs` 里做两件事：
   - 在 `BLOCK_PARSERS` 里加一个 `类型名: (rows, block, file, ctx) => { key, value }`
     （`ctx.chapter` 是当前章节号，文件顶层时为 `null`）；
   - 在 `BLOCK_SCOPE` 里登记它允许出现在哪几个分区。

3. 在 `parseZoneFile` 的章节分支里决定它落在小节的哪里 —— 追加成新块，
   还是像 `bars` 那样并入上一个同类块。
4. 在 `app/components/terminal/TerminalSection.tsx` 的 `renderSections`
   里加一个 `case "类型名":`。

新增内容块**不需要改 `journey` 或导航** —— 章节列表遍历的是生成的数据。

### 5.4 加一个新章节

1. 在 **`en/content.md`** 里加一个 `## 08 · 标题` 段落。
2. 三行元信息 `cmd` / `narration` / `takeaway` 写全，`cmd` 要在终端里有 `case`
   （章节分发是数据驱动的：`cmd` 匹配到哪一章，就渲染哪一章）。
3. 在构建脚本的 `CHAPTER_REQUIREMENTS` 里登记它必须包含哪类内容块。
4. `npm run content:check` 通过后，章节会自动出现在左侧导航和进度里。

注意：现有编号 01–07 是固定集合。**加第 8 章要把 recap 的编号往后挪**
（recap 从 07 变 08），并且 `content.md` 里的章节号必须仍然从 01 连续递增。

---

## 6. 已实现命令清单（`cmd` 只能从这里选）

```
tour      next skip start restart tour
chapter   whoami about intro me who  role do job  work projects
          skills  path career exp  contact social email  summary stats resume index
fun       hack hollywood  art buddha neumann dragon rocket  matrix  theme
misc      help man cat ping fortune history clear banner neofetch
          pwd date echo top htop git uname uptime python python3
          sudo rm exit quit vim vi nano emacs hello hi xyzzy 42
```

---

## 7. 校验清单（`content:check` 会做的事）

- [x] `en/` 目录存在，且恰好 4 个文件、名字与分区一一对应
- [x] `zone` 存在、是已知分区、且与文件名一致
- [x] 每个章节标题形如 `## NN · 标题`
- [x] 每章的 `cmd` / `narration` / `takeaway` 齐全，`cmd` 是已实现的命令
- [x] 章节编号不重复，且完整覆盖 01–07（缺章 / 多章都报）
- [x] `content` 的章节编号从 01 连续递增
- [x] 每章至少有一个内容块，且包含该章规定的那类（见构建脚本 `CHAPTER_REQUIREMENTS`）
- [x] 章节块必须挂在某个章节下，正文无游离文字
- [x] 每个块类型已注册，且出现在它被允许的分区里
- [x] `numbered` 序号从 1 连续递增
- [x] `items`/`pairs` 正好两列；`links` 正好三列；`bars` 正好三列
- [x] `bars` 等级为 1–10 整数，每组第一行必须是 `group:`
- [x] `links` 第二列是 `http(s)://` 或 `mailto:` 开头的真实链接
- [x] `field`/`settings`/`template` 的键是白名单里的真实字段
- [x] `template` 的参数签名与白名单完全一致，`{占位符}` 与参数一一对应
- [x] `cmds` 第三列的第一个词是已实现命令
- [x] `raw`/`pairs`/`trio` 都带字段名
- [x] `ui.md` 有 `inputPlaceholder` 和 `template: cmdNotFound`
- [x] 命令手册不为空

任何一项不过 → **非零退出码 + 文件名 + 行号**，并且**不会写出半成品文件**。

---

## 8. 一句话工作流

```
改 content/terminal/en/{content,recap,ui,theater}.md
        ↓
npm run content:check      # 先验，有错会告诉你是哪个文件第几行
        ↓
npm run content:build      # 编译成 term-content.generated.ts
        ↓
刷新 http://localhost:4321
```

`npm run build`（生产构建）会自动先跑 `content:build`，所以忘了手动编译也不会出错。