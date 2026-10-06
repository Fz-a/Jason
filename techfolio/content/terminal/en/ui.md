---
zone: ui
---

<!--
  UI rules: less explanation, fewer commands, stronger feedback.
  A first-time visitor only needs to do one thing: press Enter.
  In a hurry? summary. Going deep? work / skills / path.
-->

```settings
pressEnterToContinue = ⏎ press Enter to continue
orTypeACommand = or type a command · help
inputPlaceholder = type a command, e.g. summary
guidedTour = Engineering path
btnRun = Open
btnNext = Next chapter
welcomeLine1 = Welcome. I am Jason Chen, an engineer moving from electronic information engineering toward intelligent unmanned systems.
welcomeLine2a = "press "
welcomeLine2b = " to begin — six questions that map my technical path."
advancing = opening the next layer…
restarting = back at the start.
tourDoneA = ★ Path complete: Hardware → Embedded → Localization → Perception → Intelligent Systems → Low-Altitude.
tourDoneB = "want the quick version?"
tourDoneCmd = summary
tourDoneC = . Want the projects, run work.
tourDoneD = ""
manualHeader = Quick entries
manualEgg = no need to memorize commands — these entries are enough.
catUsage = usage: cat <file>
didYouMean = "did you mean "
tryHelp = (try: help)
pythonLine1 = "engineering tools are the means; the system problem is the point."
pythonLine2 = (hardware first · system thinking)
sudoSandwich = okay.
sudoDenied = get the system stable first, then talk about sudo.
rmReply = you do not delete experience, only redundancy.
exitLine1 = "there is no complicated menu here. try "
exitLine2 = "."
helloLine1 = "hello. type "
helloLine2 = " to start."
xyzzyReply = a hollow voice says: keep the system complete.
fortyTwoReply = the answer is rarely in the tool — it is in the real scenario.
unameLine = JasonOS-portfolio · Embedded · RTK · Robotics · Low-Altitude
topHeader = LAYER  COMMAND  STATUS
uptimeLine1 = Electronic Information Engineering → Embedded Systems
uptimeLine2 = Current focus: Intelligent Unmanned Systems / Low-Altitude
pingLost = 4 transmitted, 4 received, 0% packet loss
gitUsage = usage: git log | git status
gitStatusNothing = working tree clean: keep building.
gitStatusShip = (systems thinking over tool-stacking)
matrixWake = wake up, Neo… (any key to exit)
konamiLine = KONAMI ACCEPTED — SYSTEM THINKING MODE
galleryHeader = PROJECT PATH — click to open
dragonCaption = Hardware → Embedded
rocketCaption = Perception → Low-Altitude
bootTitle = JasonOS — engineering portfolio
emailLabel = email
```

```settings
hackNote_a = "  nothing to crack here. run "
hackNote_intro = " for my technical path"
hackNote_art = " for the project evolution"
hackNote_end = "."
```

```template
themeSet(next) = theme set to {next}
eggPrefix(n, total, label) = easter egg {n}/{total} — {label}
gitStatusClean(branch) = on branch {branch}
pingStats(host) = --- {host} ping statistics ---
pingHeader(host) = PING {host} 56(84) bytes of data.
cmdNotFound(cmd) = command not found: {cmd}
catNoFile(arg) = cat: {arg}: no such file (try: about.txt, skills.txt, contact.txt)
manNoEntry(arg) = no manual entry for {arg}
editorReply(cmd) = {cmd}: this portfolio stays read-only.
```

```cmds
next / skip | next chapter | next
restart | back to chapter one | restart
summary | my technical path in 10 seconds | summary
work | real projects and capability evidence | work
skills | the six-layer technical structure | skills
path | why low-altitude is the next step | path
whoami / about | my background and positioning | about
role | what kind of problem I solve | role
contact | contact details | contact
neofetch | technical identity | neofetch
git log | project evolution timeline | git log
art | project direction gallery | art
hack | engineer easter-egg mode | hack
theme | toggle theme | theme
cat <file> | about.txt · skills.txt · contact.txt | cat about.txt
ping <host> | network easter egg | ping
fortune | engineer quotes | fortune
history | command history | history
man <cmd> | manual pages | man tour
help | quick entries | help
clear | wipe the screen | clear
```