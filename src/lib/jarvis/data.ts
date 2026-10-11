import type {
  Agent,
  ActivityEntry,
  AuditEntry,
  CalendarEvent,
  ChatMessage,
  FileItem,
  Integration,
  MemoryItem,
  Note,
  Room,
  Skill,
  Task,
} from "./types";

export const ROOMS: Room[] = [
  {
    id: "command",
    name: "Command Center",
    purpose: "Orchestration, planning, system monitoring",
    tone: "crimson",
  },
  {
    id: "research",
    name: "Research Lab",
    purpose: "Web research, gathering, summarization",
    tone: "cyan",
  },
  {
    id: "university",
    name: "University",
    purpose: "Learning, teaching, specialist knowledge",
    tone: "violet",
  },
  {
    id: "computer",
    name: "Computer Lab",
    purpose: "Windows control, files, browser, screen",
    tone: "emerald",
  },
  {
    id: "automation",
    name: "Automation Room",
    purpose: "Calendar, Sheets, Gmail, Drive, n8n",
    tone: "magenta",
  },
  {
    id: "library",
    name: "Library / Hall",
    purpose: "Knowledge, reading, and meetings",
    tone: "amber",
  },
];

/** Room anchor points in % of the town canvas. */
export const ROOM_ANCHOR: Record<Room["id"], { x: number; y: number }> = {
  command: { x: 22, y: 28 },
  research: { x: 50, y: 15 },
  university: { x: 78, y: 28 },
  computer: { x: 22, y: 67 },
  automation: { x: 78, y: 67 },
  library: { x: 50, y: 86 },
};

const now = Date.now();

export const AGENTS: Agent[] = [
  {
    id: "jarvis",
    name: "JARVIS",
    avatar: "J",
    role: "Main Assistant",
    description: "Master orchestrator. Plans, delegates and supervises every agent.",
    status: "WORKING",
    currentTaskId: null,
    currentRoom: "command",
    targetRoom: "command",
    x: 25,
    y: 28,
    workload: 75,
    lastActive: now,
    capabilities: ["Planning", "Delegation", "Voice", "Memory", "Supervision"],
    permissions: ["LOW", "MEDIUM", "HIGH"],
    completed: 148,
    color: "var(--core-blue)",
  },
  {
    id: "alice",
    name: "ALICE",
    avatar: "A",
    role: "Research Agent",
    description: "Searches the web, reads sources and produces briefed summaries.",
    status: "THINKING",
    currentTaskId: null,
    currentRoom: "research",
    targetRoom: "research",
    x: 50,
    y: 17,
    workload: 65,
    lastActive: now,
    capabilities: ["Web search", "Browsing", "Summarization", "Citations"],
    permissions: ["LOW", "MEDIUM"],
    completed: 92,
    color: "var(--cyan-hud)",
  },
  {
    id: "bob",
    name: "BOB",
    avatar: "B",
    role: "Computer Agent",
    description: "Controls the Windows desktop: apps, files, keyboard, mouse, screen.",
    status: "WORKING",
    currentTaskId: null,
    currentRoom: "computer",
    targetRoom: "computer",
    x: 22,
    y: 67,
    workload: 40,
    lastActive: now,
    capabilities: ["Open apps", "File ops", "Screenshots", "Input control"],
    permissions: ["LOW", "MEDIUM", "HIGH"],
    completed: 61,
    color: "var(--success)",
  },
  {
    id: "carol",
    name: "CAROL",
    avatar: "C",
    role: "Calendar Agent",
    description: "Owns scheduling, availability and reminders across calendars.",
    status: "IDLE",
    currentTaskId: null,
    currentRoom: "automation",
    targetRoom: "automation",
    x: 78,
    y: 67,
    workload: 30,
    lastActive: now,
    capabilities: ["Calendar read", "Create events", "Reminders"],
    permissions: ["LOW", "MEDIUM"],
    completed: 44,
    color: "var(--success)",
  },
  {
    id: "dave",
    name: "DAVE",
    avatar: "D",
    role: "Automation Agent",
    description: "Runs workflows across Sheets, Gmail, Drive and n8n.",
    status: "IDLE",
    currentTaskId: null,
    currentRoom: "command",
    targetRoom: "command",
    x: 22,
    y: 28,
    workload: 20,
    lastActive: now,
    capabilities: ["Sheets", "Gmail", "Drive", "n8n workflows"],
    permissions: ["LOW", "MEDIUM"],
    completed: 37,
    color: "oklch(0.72 0.16 300)",
  },
  {
    id: "eve",
    name: "EVE",
    avatar: "E",
    role: "Security Agent",
    description: "Watches sign-ins, permissions and risky actions; asks before anything dangerous.",
    status: "WORKING",
    currentTaskId: null,
    currentRoom: "library",
    targetRoom: "library",
    x: 50,
    y: 84,
    workload: 35,
    lastActive: now,
    capabilities: ["Threat watch", "Permission checks", "Audit review", "Approvals"],
    permissions: ["LOW", "MEDIUM", "HIGH"],
    completed: 53,
    color: "var(--amber-hud)",
  },
];

export const TASKS: Task[] = [
  {
    id: "t1",
    title: "Analyze PC files",
    description: "Scan the Documents drive and produce a storage report.",
    agentId: "bob",
    room: "computer",
    status: "RUNNING",
    priority: "HIGH",
    progress: 65,
    steps: [
      { label: "Scanning directories", done: true },
      { label: "Checking file types", done: true },
      { label: "Analyzing file size", done: false },
      { label: "Generating report", done: false },
    ],
    source: "Voice command",
    createdAt: now - 600000,
    startedAt: now - 540000,
    completedAt: null,
  },
  {
    id: "t2",
    title: "Research AI news",
    description: "Collect notable AI releases from the last 24 hours.",
    agentId: "alice",
    room: "research",
    status: "QUEUED",
    priority: "NORMAL",
    progress: 0,
    steps: [
      { label: "Building search plan", done: false },
      { label: "Reading top sources", done: false },
      { label: "Cross-checking claims", done: false },
      { label: "Writing summary", done: false },
    ],
    source: "Chat",
    createdAt: now - 400000,
    startedAt: null,
    completedAt: null,
  },
  {
    id: "t3",
    title: "Check tomorrow's calendar",
    description: "Review tomorrow's schedule and find free slots.",
    agentId: "carol",
    room: "automation",
    status: "QUEUED",
    priority: "NORMAL",
    progress: 0,
    steps: [
      { label: "Opening calendar", done: false },
      { label: "Reading events", done: false },
      { label: "Finding free slots", done: false },
    ],
    source: "Chat",
    createdAt: now - 300000,
    startedAt: null,
    completedAt: null,
  },
  {
    id: "t4",
    title: "Create Google Sheet entry",
    description: "Log this week's expenses into the tracking sheet.",
    agentId: "dave",
    room: "automation",
    status: "QUEUED",
    priority: "LOW",
    progress: 0,
    steps: [
      { label: "Opening sheet", done: false },
      { label: "Appending row", done: false },
      { label: "Verifying write", done: false },
    ],
    source: "Workflow",
    createdAt: now - 120000,
    startedAt: null,
    completedAt: null,
  },
];

export const ACTIVITY: ActivityEntry[] = [
  { id: "a1", ts: now - 60000, agentId: "bob", action: "started analyzing files", status: "INFO" },
  { id: "a2", ts: now - 140000, agentId: "alice", action: "found 3 relevant sources", status: "SUCCESS" },
  { id: "a3", ts: now - 220000, agentId: "carol", action: "checked calendar availability", status: "SUCCESS" },
  { id: "a4", ts: now - 300000, agentId: "jarvis", action: "completed a planning cycle", status: "SUCCESS" },
  { id: "a5", ts: now - 380000, agentId: "dave", action: "is now idle", status: "INFO" },
];

export const AUDIT: AuditEntry[] = [
  { id: "x1", ts: now - 90000, agentId: "bob", tool: "Windows", action: "Opened Chrome", result: "SUCCESS", risk: "LOW" },
  { id: "x2", ts: now - 400000, agentId: "dave", tool: "Google Sheets", action: "Appended row to Expenses", result: "SUCCESS", risk: "MEDIUM" },
  { id: "x3", ts: now - 900000, agentId: "bob", tool: "Windows", action: "Delete folder /temp", result: "BLOCKED", risk: "HIGH" },
  { id: "x4", ts: now - 1500000, agentId: "alice", tool: "Browser", action: "Fetched 12 pages", result: "SUCCESS", risk: "LOW" },
];

export const CHAT: ChatMessage[] = [
  { id: "c1", role: "user", text: "Check my calendar tomorrow.", ts: now - 240000 },
  {
    id: "c2",
    role: "jarvis",
    text: "Checking your calendar...",
    ts: now - 238000,
    steps: ["Opening Google Calendar", "Checking availability", "Found 3 available slots"],
  },
  {
    id: "c3",
    role: "user",
    text: "Great. Also research what's new in AI today.",
    ts: now - 120000,
  },
  {
    id: "c4",
    role: "jarvis",
    text: "Assigned to ALICE in the Research Lab. I'll report back with a summary.",
    ts: now - 118000,
  },
];

export const INTEGRATIONS: Integration[] = [
  { id: "openclaw", name: "OpenClaw", category: "Agent engine", status: "DISCONNECTED", detail: "Gateway URL & token not configured" },
  { id: "gcal", name: "Google Calendar", category: "Productivity", status: "DISCONNECTED", detail: "OAuth not authorized" },
  { id: "gsheets", name: "Google Sheets", category: "Productivity", status: "DISCONNECTED", detail: "OAuth not authorized" },
  { id: "gmail", name: "Gmail", category: "Productivity", status: "DISCONNECTED", detail: "OAuth not authorized" },
  { id: "gdrive", name: "Google Drive", category: "Storage", status: "DISCONNECTED", detail: "OAuth not authorized" },
  { id: "elevenlabs", name: "ElevenLabs", category: "Voice", status: "DISCONNECTED", detail: "Server-side API key required" },
  { id: "n8n", name: "n8n", category: "Workflows", status: "DISCONNECTED", detail: "Webhook base URL required" },
  { id: "browser", name: "Browser", category: "Control", status: "DISCONNECTED", detail: "Needs OpenClaw bridge" },
  { id: "windows", name: "Windows", category: "Control", status: "DISCONNECTED", detail: "Windows control: not connected" },
  { id: "cloud", name: "Cloud Database", category: "Backend", status: "DISCONNECTED", detail: "Persistence not enabled yet" },
];

export const SKILLS: Skill[] = [
  { id: "s1", name: "Web Research", description: "Search, browse and summarize sources.", enabled: true, risk: "LOW", requires: ["Browser"], lastUsed: "2 min ago" },
  { id: "s2", name: "Windows Control", description: "Open apps, control keyboard, mouse and screen.", enabled: false, risk: "HIGH", requires: ["OpenClaw", "Windows"], lastUsed: "—" },
  { id: "s3", name: "Calendar", description: "Read and create calendar events.", enabled: false, risk: "MEDIUM", requires: ["Google Calendar"], lastUsed: "—" },
  { id: "s4", name: "Google Sheets", description: "Read and append spreadsheet rows.", enabled: false, risk: "MEDIUM", requires: ["Google Sheets"], lastUsed: "—" },
  { id: "s5", name: "Gmail", description: "Read, draft and send email.", enabled: false, risk: "HIGH", requires: ["Gmail"], lastUsed: "—" },
  { id: "s6", name: "Drive", description: "Browse and organize cloud files.", enabled: false, risk: "MEDIUM", requires: ["Google Drive"], lastUsed: "—" },
  { id: "s7", name: "File Management", description: "Search, move, rename local files.", enabled: false, risk: "HIGH", requires: ["Windows"], lastUsed: "—" },
  { id: "s8", name: "Browser Control", description: "Drive a real browser session.", enabled: false, risk: "MEDIUM", requires: ["OpenClaw"], lastUsed: "—" },
  { id: "s9", name: "Voice", description: "Speech-to-text and text-to-speech.", enabled: true, risk: "LOW", requires: ["Microphone"], lastUsed: "8 min ago" },
  { id: "s10", name: "Notes", description: "Capture and retrieve notes.", enabled: true, risk: "LOW", requires: [], lastUsed: "1 h ago" },
  { id: "s11", name: "Automation", description: "Trigger n8n workflows.", enabled: false, risk: "MEDIUM", requires: ["n8n"], lastUsed: "—" },
];

export const MEMORIES: MemoryItem[] = [
  { id: "m1", category: "User Preferences", title: "Prefers concise briefings", content: "Summaries should be under 5 bullet points unless asked.", importance: "HIGH", source: "Chat", ts: now - 86400000 },
  { id: "m2", category: "User Preferences", title: "Works 09:00 – 19:00 IST", content: "Do not schedule meetings outside this window.", importance: "HIGH", source: "Settings", ts: now - 172800000 },
  { id: "m3", category: "Projects", title: "JARVIS desktop build", content: "Primary project: a Windows AI desktop assistant with agent town UI.", importance: "HIGH", source: "Conversation", ts: now - 259200000 },
  { id: "m4", category: "Important Information", title: "Weekly review Friday", content: "Project review happens every Friday at 15:00.", importance: "MEDIUM", source: "Calendar", ts: now - 432000000 },
  { id: "m5", category: "Conversations", title: "AI news interest", content: "Interested in agent frameworks and computer-use models.", importance: "MEDIUM", source: "Chat", ts: now - 500000000 },
  { id: "m6", category: "Long-Term Memory", title: "Non-coder workflow", content: "Explain results in plain language, avoid technical jargon.", importance: "HIGH", source: "Chat", ts: now - 600000000 },
];

export const NOTES: Note[] = [
  { id: "n1", title: "Agent town ideas", body: "Add a courier agent that carries results between rooms.", pinned: true, tags: ["ideas", "ui"], ts: now - 3600000 },
  { id: "n2", title: "Voice script", body: "Wake word: 'Jarvis'. Fallback to push-to-talk button.", pinned: false, tags: ["voice"], ts: now - 86400000 },
  { id: "n3", title: "Weekly goals", body: "Ship dashboard, wire OpenClaw, test Windows control safely.", pinned: false, tags: ["planning"], ts: now - 172800000 },
];

export const EVENTS: CalendarEvent[] = [
  { id: "e1", title: "Team Sync", time: "10:00 AM", durationMin: 30, tag: "Work" },
  { id: "e2", title: "Lunch Break", time: "12:30 PM", durationMin: 45, tag: "Personal" },
  { id: "e3", title: "Project Review", time: "3:00 PM", durationMin: 60, tag: "Work" },
  { id: "e4", title: "AI Research", time: "5:00 PM", durationMin: 90, tag: "Focus" },
  { id: "e5", title: "Gym", time: "7:00 PM", durationMin: 60, tag: "Personal" },
];

export const FILES: FileItem[] = [
  { id: "f1", name: "jarvis-spec.md", type: "Markdown", size: "42 KB", modified: "2 min ago", folder: "Documents" },
  { id: "f2", name: "agent-town.fig", type: "Design", size: "18 MB", modified: "1 h ago", folder: "Design" },
  { id: "f3", name: "expenses-2026.xlsx", type: "Spreadsheet", size: "240 KB", modified: "Yesterday", folder: "Finance" },
  { id: "f4", name: "meeting-notes.docx", type: "Document", size: "96 KB", modified: "Yesterday", folder: "Documents" },
  { id: "f5", name: "core-render.png", type: "Image", size: "3.4 MB", modified: "2 days ago", folder: "Media" },
  { id: "f6", name: "backup-archive.zip", type: "Archive", size: "1.2 GB", modified: "Last week", folder: "Backups" },
];

export const TASK_TEMPLATES: Record<
  string,
  { room: Task["room"]; steps: string[] }
> = {
  alice: { room: "research", steps: ["Building search plan", "Reading sources", "Cross-checking", "Writing summary"] },
  bob: { room: "computer", steps: ["Opening workspace", "Running operation", "Verifying result", "Reporting back"] },
  carol: { room: "automation", steps: ["Opening calendar", "Reading events", "Finding slots"] },
  dave: { room: "automation", steps: ["Opening workflow", "Executing steps", "Verifying output"] },
  jarvis: { room: "command", steps: ["Understanding request", "Planning", "Delegating", "Reviewing result"] },
};

export function taskTemplate(agentId: string): { room: Task["room"]; steps: string[] } {
  return TASK_TEMPLATES[agentId] ?? { room: "command", steps: ["Understanding request", "Planning", "Executing", "Reviewing"] };
}
