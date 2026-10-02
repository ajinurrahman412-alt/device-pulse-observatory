import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ACTIVITY,
  AGENTS,
  AUDIT,
  CHAT,
  EVENTS,
  FILES,
  INTEGRATIONS,
  MEMORIES,
  NOTES,
  ROOM_ANCHOR,
  SKILLS,
  TASKS,
  taskTemplate,
} from "./data";
import type {
  ActivityEntry,
  Agent,
  AuditEntry,
  CalendarEvent,
  ChatMessage,
  FileItem,
  Integration,
  JarvisState,
  MemoryItem,
  Note,
  RoomId,
  Skill,
  Task,
} from "./types";
import { supabase } from "@/integrations/supabase/client";
import { askJarvis } from "./ai.functions";

const uid = () => Math.random().toString(36).slice(2, 10);

const AGENT_OFFSET: Record<string, { dx: number; dy: number }> = {
  jarvis: { dx: 0, dy: 0 },
  alice: { dx: 7, dy: 12 },
  bob: { dx: 7, dy: -5 },
  carol: { dx: -8, dy: 5 },
  dave: { dx: -7, dy: 10 },
};

interface JarvisContextValue {
  agents: Agent[];
  tasks: Task[];
  activity: ActivityEntry[];
  audit: AuditEntry[];
  chat: ChatMessage[];
  integrations: Integration[];
  skills: Skill[];
  memories: MemoryItem[];
  notes: Note[];
  events: CalendarEvent[];
  files: FileItem[];
  jarvisState: JarvisState;
  voiceActive: boolean;
  selectedAgentId: string | null;
  runningTask: Task | null;
  setSelectedAgentId: (id: string | null) => void;
  setJarvisState: (s: JarvisState) => void;
  toggleVoice: () => void;
  createTask: (input: { title: string; agentId: string; priority?: Task["priority"]; source?: string }) => void;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
  prioritizeTask: (id: string) => void;
  reassignTask: (id: string, agentId: string) => void;
  sendMessage: (text: string) => void;
  toggleIntegration: (id: string) => void;
  toggleSkill: (id: string) => void;
  addMemory: (m: Omit<MemoryItem, "id" | "ts">) => void;
  deleteMemory: (id: string) => void;
  addNote: (n: Pick<Note, "title" | "body" | "tags">) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addEvent: (e: Omit<CalendarEvent, "id">) => void;
  deleteEvent: (id: string) => void;
  logActivity: (agentId: string, action: string, status?: ActivityEntry["status"]) => void;
  userEmail: string | null;
  /** Server-verified role of the signed-in account; null when signed out. */
  userRole: "owner" | "admin" | "user" | null;
}

// Keep one context instance across hot reloads so provider and consumers always match.
const g = globalThis as unknown as { __jarvisCtx?: React.Context<JarvisContextValue | null> };
const JarvisContext = g.__jarvisCtx ?? (g.__jarvisCtx = createContext<JarvisContextValue | null>(null));

export function JarvisProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [activity, setActivity] = useState<ActivityEntry[]>(ACTIVITY);
  const [audit, setAudit] = useState<AuditEntry[]>(AUDIT);
  const [chat, setChat] = useState<ChatMessage[]>(CHAT);
  const chatRef = useRef(chat);
  chatRef.current = chat;
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [skills, setSkills] = useState<Skill[]>(SKILLS);
  const [memories, setMemories] = useState<MemoryItem[]>(MEMORIES);
  const [notes, setNotes] = useState<Note[]>(NOTES);
  const [events, setEvents] = useState<CalendarEvent[]>(EVENTS);
  const [files] = useState<FileItem[]>(FILES);
  const [jarvisState, setJarvisState] = useState<JarvisState>("IDLE");
  const [voiceActive, setVoiceActive] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const voiceRef = useRef(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"owner" | "admin" | "user" | null>(null);
  const uidRef = useRef<string | null>(null);

  const loadUserData = useCallback(async () => {
    const [n, m, e] = await Promise.all([
      supabase.from("notes").select("*").order("created_at", { ascending: false }),
      supabase.from("memories").select("*").order("created_at", { ascending: false }),
      supabase.from("events").select("*").order("time"),
    ]);
    if (n.data) setNotes(n.data.map((r) => ({ id: r.id, title: r.title, body: r.body, pinned: r.pinned, tags: r.tags, ts: Date.parse(r.created_at) })));
    if (m.data) setMemories(m.data.map((r) => ({ id: r.id, category: r.category, title: r.title, content: r.content, importance: r.importance as MemoryItem["importance"], source: r.source, ts: Date.parse(r.created_at) })));
    if (e.data) setEvents(e.data.map((r) => ({ id: r.id, title: r.title, time: r.time, durationMin: r.duration_min, tag: r.tag })));
  }, []);

  useEffect(() => {
    const apply = (u: { id: string; email?: string | null } | null) => {
      const changed = uidRef.current !== (u?.id ?? null);
      uidRef.current = u?.id ?? null;
      setUserId(u?.id ?? null);
      setUserEmail(u?.email ?? null);
      if (!changed) return;
      if (u) {
        void loadUserData();
        void supabase.rpc("ensure_my_role").then(({ data, error }) => setUserRole(error ? "user" : (data ?? "user")));
      } else setUserRole(null);
      if (!u) { setNotes(NOTES); setMemories(MEMORIES); setEvents(EVENTS); }
    };
    const { data } = supabase.auth.onAuthStateChange((_ev, session) => apply(session?.user ?? null));
    supabase.auth.getSession().then(({ data: d }) => apply(d.session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, [loadUserData]);

  const logActivity = useCallback(
    (agentId: string, action: string, status: ActivityEntry["status"] = "INFO") => {
      setActivity((prev) => [{ id: uid(), ts: Date.now(), agentId, action, status }, ...prev].slice(0, 60));
    },
    [],
  );

  /* ---------------- simulation engine ---------------- */
  useEffect(() => {
    const interval = window.setInterval(() => {
      setTasks((prevTasks) => {
        let next = prevTasks.map((t) => ({ ...t, steps: t.steps.map((s) => ({ ...s })) }));

        const running = next.filter((t) => t.status === "RUNNING");
        if (running.length < 2) {
          const queued = next.find((t) => t.status === "QUEUED");
          if (queued) {
            queued.status = "RUNNING";
            queued.startedAt = Date.now();
            logActivity(queued.agentId, `started "${queued.title}"`, "INFO");
          }
        }

        next = next.map((task) => {
          if (task.status !== "RUNNING") return task;
          const inc = 3 + Math.random() * 7;
          const progress = Math.min(100, task.progress + inc);
          const doneCount = Math.floor((progress / 100) * task.steps.length);
          const steps = task.steps.map((s, i) => ({ ...s, done: i < doneCount }));
          if (progress >= 100) {
            logActivity(task.agentId, `completed "${task.title}"`, "SUCCESS");
            setAudit((prev) =>
              [
                {
                  id: uid(),
                  ts: Date.now(),
                  agentId: task.agentId,
                  tool: task.room === "computer" ? "Windows" : task.room === "research" ? "Browser" : "Workflow",
                  action: task.title,
                  result: "SUCCESS" as const,
                  risk: "LOW" as const,
                },
                ...prev,
              ].slice(0, 60),
            );
            return {
              ...task,
              progress: 100,
              steps: steps.map((s) => ({ ...s, done: true })),
              status: "COMPLETED" as const,
              completedAt: Date.now(),
            };
          }
          return { ...task, progress, steps };
        });

        // agents follow their tasks
        setAgents((prevAgents) =>
          prevAgents.map((agent) => {
            const task = next.find((t) => t.agentId === agent.id && t.status === "RUNNING");
            const offset = AGENT_OFFSET[agent.id] ?? { dx: 0, dy: 0 };
            const targetRoom: RoomId = task ? task.room : agent.id === "jarvis" ? "command" : agent.currentRoom;
            const anchor = ROOM_ANCHOR[targetRoom];
            const tx = anchor.x + offset.dx;
            const ty = anchor.y + offset.dy;
            const dx = tx - agent.x;
            const dy = ty - agent.y;
            const dist = Math.hypot(dx, dy);
            const moving = dist > 1.2;
            const x = moving ? agent.x + dx * 0.25 : tx;
            const y = moving ? agent.y + dy * 0.25 : ty;
            const completedNow = next.some(
              (t) => t.agentId === agent.id && t.status === "COMPLETED" && t.completedAt && Date.now() - t.completedAt < 2000,
            );

            let status = agent.status;
            if (task) status = moving ? "THINKING" : "WORKING";
            else if (completedNow) status = "COMPLETED";
            else status = agent.id === "jarvis" ? "IDLE" : "RESTING";

            const workload = Math.max(
              5,
              Math.min(100, task ? agent.workload + 1.5 : agent.workload - 1.2),
            );

            return {
              ...agent,
              x,
              y,
              currentRoom: moving ? agent.currentRoom : targetRoom,
              targetRoom,
              status,
              currentTaskId: task?.id ?? null,
              workload: Math.round(workload),
              lastActive: task ? Date.now() : agent.lastActive,
            };
          }),
        );

        return next;
      });
    }, 1100);
    return () => window.clearInterval(interval);
  }, [logActivity]);

  // JARVIS core state derives from work, unless voice is driving it
  useEffect(() => {
    if (voiceRef.current) return;
    const running = tasks.some((t) => t.status === "RUNNING");
    const failed = tasks.some((t) => t.status === "FAILED");
    setJarvisState(failed ? "ERROR" : running ? "EXECUTING" : "IDLE");
  }, [tasks]);

  const runningTask = useMemo(
    () => tasks.find((t) => t.status === "RUNNING") ?? null,
    [tasks],
  );

  /* ---------------- actions ---------------- */
  const createTask = useCallback<JarvisContextValue["createTask"]>(
    ({ title, agentId, priority = "NORMAL", source = "Manual" }) => {
      const tpl = taskTemplate(agentId);
      const task: Task = {
        id: uid(),
        title,
        description: title,
        agentId,
        room: tpl.room,
        status: "QUEUED",
        priority,
        progress: 0,
        steps: tpl.steps.map((label) => ({ label, done: false })),
        source,
        createdAt: Date.now(),
        startedAt: null,
        completedAt: null,
      };
      setTasks((prev) => [...prev, task]);
      logActivity(agentId, `queued "${title}"`, "INFO");
    },
    [logActivity],
  );

  const updateTaskStatus = useCallback<JarvisContextValue["updateTaskStatus"]>(
    (id, status) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                progress: status === "QUEUED" ? 0 : t.progress,
                steps: status === "QUEUED" ? t.steps.map((s) => ({ ...s, done: false })) : t.steps,
                completedAt: status === "COMPLETED" ? Date.now() : null,
              }
            : t,
        ),
      );
    },
    [],
  );

  const prioritizeTask = useCallback((id: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (!task) return prev;
      const rest = prev.filter((t) => t.id !== id);
      return [{ ...task, priority: "HIGH" as const }, ...rest];
    });
  }, []);

  const reassignTask = useCallback((id: string, agentId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, agentId, room: taskTemplate(agentId).room } : t,
      ),
    );
  }, []);

  const sendMessage = useCallback<JarvisContextValue["sendMessage"]>(
    (text) => {
      const userMsg: ChatMessage = { id: uid(), role: "user", text, ts: Date.now() };
      setChat((prev) => [...prev, userMsg]);
      setJarvisState("THINKING");

      const lower = text.toLowerCase();
      const agentId = lower.includes("calendar") || lower.includes("schedule")
        ? "carol"
        : lower.includes("file") || lower.includes("pc") || lower.includes("open")
          ? "bob"
          : lower.includes("sheet") || lower.includes("mail") || lower.includes("workflow")
            ? "dave"
            : "alice";

      const history = [...chatRef.current, userMsg].slice(-12).map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));
      askJarvis({ data: { messages: history } })
        .catch(() => ({ text: "I couldn't reach my AI core. Please try again.", error: true }))
        .then((r) => {
          const tpl = taskTemplate(agentId);
          setChat((prev) => [
            ...prev,
            { id: uid(), role: "jarvis", text: r.text, ts: Date.now(), ...(r.error ? {} : { steps: tpl.steps }) },
          ]);
          if (r.error) {
            setJarvisState("ERROR");
            return;
          }
          createTask({ title: text.slice(0, 60), agentId, source: "Chat" });
          setJarvisState("EXECUTING");
        });
    },
    [createTask],
  );

  const toggleVoice = useCallback(() => {
    setVoiceActive((prev) => {
      const next = !prev;
      voiceRef.current = next;
      setJarvisState(next ? "LISTENING" : "IDLE");
      logActivity("jarvis", next ? "voice session started" : "voice session ended", "INFO");
      return next;
    });
  }, [logActivity]);

  const toggleIntegration = useCallback((id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: i.status === "CONNECTED" ? "DISCONNECTED" : "CONNECTING",
              detail: i.status === "CONNECTED" ? "Disconnected by user" : "Awaiting real credentials",
            }
          : i,
      ),
    );
  }, []);

  const toggleSkill = useCallback((id: string) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }, []);

  const addMemory = useCallback<JarvisContextValue["addMemory"]>((m) => {
    const id = crypto.randomUUID();
    setMemories((prev) => [{ ...m, id, ts: Date.now() }, ...prev]);
    if (userId) void supabase.from("memories").insert({ id, user_id: userId, ...m });
  }, [userId]);
  const deleteMemory = useCallback((id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    if (userId) void supabase.from("memories").delete().eq("id", id);
  }, [userId]);

  const addNote = useCallback<JarvisContextValue["addNote"]>((n) => {
    const id = crypto.randomUUID();
    setNotes((prev) => [{ ...n, id, pinned: false, ts: Date.now() }, ...prev]);
    if (userId) void supabase.from("notes").insert({ id, user_id: userId, title: n.title, body: n.body, tags: n.tags });
  }, [userId]);
  const updateNote = useCallback((id: string, patch: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
    if (userId) {
      const row: { title?: string; body?: string; pinned?: boolean; tags?: string[] } = {};
      if (patch.title !== undefined) row.title = patch.title;
      if (patch.body !== undefined) row.body = patch.body;
      if (patch.pinned !== undefined) row.pinned = patch.pinned;
      if (patch.tags !== undefined) row.tags = patch.tags;
      void supabase.from("notes").update(row).eq("id", id);
    }
  }, [userId]);
  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (userId) void supabase.from("notes").delete().eq("id", id);
  }, [userId]);

  const addEvent = useCallback<JarvisContextValue["addEvent"]>((e) => {
    const id = crypto.randomUUID();
    setEvents((prev) => [...prev, { ...e, id }]);
    if (userId) void supabase.from("events").insert({ id, user_id: userId, title: e.title, time: e.time, duration_min: e.durationMin, tag: e.tag });
  }, [userId]);
  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (userId) void supabase.from("events").delete().eq("id", id);
  }, [userId]);

  const value: JarvisContextValue = {
    agents,
    tasks,
    activity,
    audit,
    chat,
    integrations,
    skills,
    memories,
    notes,
    events,
    files,
    jarvisState,
    voiceActive,
    selectedAgentId,
    runningTask,
    setSelectedAgentId,
    setJarvisState,
    toggleVoice,
    createTask,
    updateTaskStatus,
    prioritizeTask,
    reassignTask,
    sendMessage,
    toggleIntegration,
    toggleSkill,
    addMemory,
    deleteMemory,
    addNote,
    updateNote,
    deleteNote,
    addEvent,
    deleteEvent,
    logActivity,
    userEmail,
    userRole,
  };

  return <JarvisContext.Provider value={value}>{children}</JarvisContext.Provider>;
}

export function useJarvis() {
  const ctx = useContext(JarvisContext);
  if (!ctx) throw new Error("useJarvis must be used inside JarvisProvider");
  return ctx;
}

export function useAgent(id: string | null) {
  const { agents } = useJarvis();
  return agents.find((a) => a.id === id) ?? null;
}

export const statusColor: Record<string, string> = {
  WORKING: "var(--success)",
  THINKING: "var(--cyan-hud)",
  IDLE: "var(--muted-foreground)",
  RESTING: "var(--muted-foreground)",
  WAITING: "var(--amber-hud)",
  COMPLETED: "var(--success)",
  ERROR: "var(--crimson-bright)",
  OFFLINE: "var(--muted-foreground)",
  RUNNING: "var(--success)",
  QUEUED: "var(--amber-hud)",
  FAILED: "var(--crimson-bright)",
  CANCELLED: "var(--muted-foreground)",
};

export function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function clock(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
