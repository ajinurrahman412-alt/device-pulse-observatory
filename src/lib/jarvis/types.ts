export type RoomId = "command" | "research" | "university" | "computer" | "automation" | "library";

export type AgentStatus =
  | "IDLE"
  | "WORKING"
  | "THINKING"
  | "WAITING"
  | "RESTING"
  | "COMPLETED"
  | "ERROR"
  | "OFFLINE";

export type JarvisState =
  | "IDLE"
  | "LISTENING"
  | "THINKING"
  | "PLANNING"
  | "EXECUTING"
  | "SPEAKING"
  | "WAITING"
  | "ERROR"
  | "COMPLETED";

export type TaskStatus =
  | "QUEUED"
  | "RUNNING"
  | "WAITING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Room {
  id: RoomId;
  name: string;
  purpose: string;
  tone: "crimson" | "cyan" | "violet" | "emerald" | "magenta" | "amber";
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  description: string;
  status: AgentStatus;
  currentTaskId: string | null;
  currentRoom: RoomId;
  targetRoom: RoomId;
  /** percentage coordinates inside the town canvas */
  x: number;
  y: number;
  workload: number;
  lastActive: number;
  capabilities: string[];
  permissions: RiskLevel[];
  completed: number;
  color: string;
}

export interface TaskStep {
  label: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  agentId: string;
  room: RoomId;
  status: TaskStatus;
  priority: "LOW" | "NORMAL" | "HIGH";
  progress: number;
  steps: TaskStep[];
  source: string;
  createdAt: number;
  startedAt: number | null;
  completedAt: number | null;
}

export interface ActivityEntry {
  id: string;
  ts: number;
  agentId: string;
  action: string;
  status: "INFO" | "SUCCESS" | "WARN" | "ERROR";
}

export interface AuditEntry {
  id: string;
  ts: number;
  agentId: string;
  tool: string;
  action: string;
  result: "SUCCESS" | "BLOCKED" | "FAILED";
  risk: RiskLevel;
}

export interface ChatMessage {
  id: string;
  role: "user" | "jarvis";
  text: string;
  ts: number;
  steps?: string[];
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: "CONNECTED" | "DISCONNECTED" | "CONNECTING" | "ERROR";
  detail: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  risk: RiskLevel;
  requires: string[];
  lastUsed: string;
}

export interface MemoryItem {
  id: string;
  category: string;
  title: string;
  content: string;
  importance: "LOW" | "MEDIUM" | "HIGH";
  source: string;
  ts: number;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  tags: string[];
  ts: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  durationMin: number;
  tag: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  folder: string;
}
