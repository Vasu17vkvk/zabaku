import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TaskDetailsDrawer, type DrawerTask } from "@/features/tasks/components/TaskDetailsDrawer";
import {
  Plus, Search, Filter, LayoutGrid, Table as TableIcon, Calendar as CalendarIcon,
  GitBranch, ChevronDown, MoreHorizontal, MessageSquare, Paperclip, CheckSquare,
  Flag, Sparkles, ChevronLeft, ChevronRight, Circle, CheckCircle2, GripVertical,
  Clock, ArrowUpDown, X,
} from "lucide-react";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Zabaku" },
      { name: "description", content: "Plan, drag, and ship — every task across your Zabaku workspace in Kanban, table, calendar, or timeline view." },
      { property: "og:title", content: "Tasks — Zabaku" },
      { property: "og:description", content: "Plan, drag, and ship — every task across your Zabaku workspace in Kanban, table, calendar, or timeline view." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TasksPage,
});

/* ============ types & data ============ */
type Priority = "Urgent" | "High" | "Medium" | "Low";
type StatusKey = "todo" | "in_progress" | "review" | "done";

type Member = { initials: string; color: string };
type Task = {
  id: string;
  key: string;
  title: string;
  description?: string;
  status: StatusKey;
  priority: Priority;
  due: string;
  dueDay: number; // 1..31 for July demo
  members: Member[];
  tags: { label: string; tone: string }[];
  checklist: { done: number; total: number };
  comments: number;
  attachments: number;
  project: { key: string; name: string; color: string };
};

const M = {
  AK: { initials: "AK", color: "oklch(0.72 0.16 180)" },
  JL: { initials: "JL", color: "oklch(0.55 0.22 279)" },
  MB: { initials: "MB", color: "oklch(0.75 0.16 92)" },
  SR: { initials: "SR", color: "oklch(0.68 0.17 28)" },
  PS: { initials: "PS", color: "oklch(0.62 0.19 30)" },
} as const;

const TAGS = {
  frontend: { label: "Frontend", tone: "bg-primary/12 text-primary" },
  backend: { label: "Backend", tone: "bg-accent/15 text-accent-foreground" },
  design: { label: "Design", tone: "bg-warning/15 text-warning" },
  bug: { label: "Bug", tone: "bg-danger/12 text-danger" },
  research: { label: "Research", tone: "bg-success/15 text-success" },
  ai: { label: "AI", tone: "bg-secondary text-foreground" },
} as const;

const INITIAL_TASKS: Task[] = [
  {
    id: "1", key: "PAY-151", title: "Idempotency keys audit",
    description: "Verify all POST endpoints accept an idempotency key and dedupe correctly.",
    status: "in_progress", priority: "Urgent", due: "Jul 28", dueDay: 28,
    members: [M.SR, M.AK], tags: [TAGS.backend, TAGS.bug],
    checklist: { done: 3, total: 8 }, comments: 12, attachments: 2,
    project: { key: "PAY", name: "Payments v2", color: "oklch(0.55 0.22 279)" },
  },
  {
    id: "2", key: "PAY-149", title: "Currency picker states",
    description: "Empty, loading, error, and no-results variants.",
    status: "in_progress", priority: "Medium", due: "Jul 30", dueDay: 30,
    members: [M.MB], tags: [TAGS.frontend, TAGS.design],
    checklist: { done: 2, total: 5 }, comments: 4, attachments: 1,
    project: { key: "PAY", name: "Payments v2", color: "oklch(0.55 0.22 279)" },
  },
  {
    id: "3", key: "ONB-32", title: "Sample data for new workspaces",
    status: "todo", priority: "High", due: "Aug 04", dueDay: 4,
    members: [M.MB, M.JL], tags: [TAGS.backend, TAGS.research],
    checklist: { done: 0, total: 4 }, comments: 2, attachments: 0,
    project: { key: "ONB", name: "Onboarding", color: "oklch(0.75 0.16 92)" },
  },
  {
    id: "4", key: "DS-88", title: "Motion tokens for elevation",
    description: "Define spring curves for card lift, tooltip, and dialog.",
    status: "review", priority: "High", due: "Jul 26", dueDay: 26,
    members: [M.JL, M.MB], tags: [TAGS.design],
    checklist: { done: 6, total: 6 }, comments: 21, attachments: 4,
    project: { key: "DS", name: "Design system", color: "oklch(0.68 0.16 320)" },
  },
  {
    id: "5", key: "AI-14", title: "Copilot guardrail evals",
    status: "todo", priority: "Urgent", due: "Aug 02", dueDay: 2,
    members: [M.PS, M.AK], tags: [TAGS.ai, TAGS.research],
    checklist: { done: 1, total: 6 }, comments: 8, attachments: 3,
    project: { key: "AI", name: "AI Copilot", color: "oklch(0.62 0.19 30)" },
  },
  {
    id: "6", key: "MOB-19", title: "Push notification permissions",
    status: "in_progress", priority: "High", due: "Aug 01", dueDay: 1,
    members: [M.SR], tags: [TAGS.frontend],
    checklist: { done: 4, total: 7 }, comments: 3, attachments: 0,
    project: { key: "MOB", name: "Mobile beta", color: "oklch(0.72 0.16 180)" },
  },
  {
    id: "7", key: "PAY-142", title: "Refund flow polish",
    status: "done", priority: "High", due: "Jul 24", dueDay: 24,
    members: [M.AK], tags: [TAGS.frontend, TAGS.design],
    checklist: { done: 5, total: 5 }, comments: 18, attachments: 6,
    project: { key: "PAY", name: "Payments v2", color: "oklch(0.55 0.22 279)" },
  },
  {
    id: "8", key: "DS-91", title: "Icon set audit",
    status: "todo", priority: "Low", due: "Aug 12", dueDay: 12,
    members: [M.MB], tags: [TAGS.design],
    checklist: { done: 0, total: 3 }, comments: 1, attachments: 0,
    project: { key: "DS", name: "Design system", color: "oklch(0.68 0.16 320)" },
  },
  {
    id: "9", key: "SEC-04", title: "Audit-log retention policy",
    status: "review", priority: "Medium", due: "Jul 29", dueDay: 29,
    members: [M.PS, M.SR], tags: [TAGS.backend, TAGS.research],
    checklist: { done: 3, total: 4 }, comments: 7, attachments: 2,
    project: { key: "SEC", name: "SOC 2", color: "oklch(0.55 0.14 250)" },
  },
  {
    id: "10", key: "GRW-11", title: "Pricing page A/B setup",
    status: "done", priority: "Medium", due: "Jul 18", dueDay: 18,
    members: [M.MB, M.JL], tags: [TAGS.frontend],
    checklist: { done: 4, total: 4 }, comments: 5, attachments: 1,
    project: { key: "GRW", name: "Growth", color: "oklch(0.68 0.16 155)" },
  },
];

const COLUMNS: { key: StatusKey; title: string; tone: string; dot: string }[] = [
  { key: "todo", title: "Todo", tone: "bg-muted-foreground", dot: "bg-muted-foreground" },
  { key: "in_progress", title: "In progress", tone: "bg-primary", dot: "bg-primary" },
  { key: "review", title: "In review", tone: "bg-accent", dot: "bg-accent" },
  { key: "done", title: "Done", tone: "bg-success", dot: "bg-success" },
];

/* ============ page ============ */
type ViewKey = "kanban" | "table" | "calendar" | "timeline";

function TasksPage() {
  const [view, setView] = useState<ViewKey>("kanban");
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [query, setQuery] = useState("");
  const [openTask, setOpenTask] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return tasks;
    const q = query.toLowerCase();
    return tasks.filter((t) => `${t.title} ${t.key} ${t.description ?? ""}`.toLowerCase().includes(q));
  }, [tasks, query]);

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.005_265)] text-foreground">
      <main className="mx-auto max-w-[1600px] px-6 py-8 lg:px-10 lg:py-10">
        <Header />
        <Toolbar view={view} setView={setView} query={query} setQuery={setQuery} />
        <div className="mt-6">
          {view === "kanban" && <KanbanBoard tasks={filtered} setTasks={setTasks} onOpen={setOpenTask} />}
          {view === "table" && <TableView tasks={filtered} onOpen={setOpenTask} />}
          {view === "calendar" && <CalendarView tasks={filtered} />}
          {view === "timeline" && <TimelineView tasks={filtered} />}
        </div>
      </main>
      <TaskDetailsDrawer task={openTask as DrawerTask | null} onClose={() => setOpenTask(null)} />
    </div>
  );
}

/* ============ header ============ */
function Header() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11.5px] font-medium text-muted-foreground">
          <span>Workspace</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Tasks</span>
        </div>
        <h1 className="mt-1 truncate text-[26px] font-semibold tracking-[-0.02em] sm:text-[28px]">Tasks</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          <span className="font-medium text-foreground">{INITIAL_TASKS.length} tasks</span> · 6 due this week ·
          <span className="ml-1 text-danger">2 overdue</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button className="flex h-10 items-center gap-1.5 rounded-xl border border-border/70 bg-white px-3 text-[12.5px] font-semibold shadow-xs hover:bg-secondary">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Plan sprint with AI
        </button>
        <button className="flex h-10 items-center gap-1.5 rounded-xl bg-gradient-primary px-3.5 text-[13px] font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]">
          <Plus className="h-4 w-4" /> New task
        </button>
      </div>
    </div>
  );
}

/* ============ toolbar ============ */
function Toolbar({
  view, setView, query, setQuery,
}: { view: ViewKey; setView: (v: ViewKey) => void; query: string; setQuery: (v: string) => void }) {
  const views: { key: ViewKey; label: string; icon: any }[] = [
    { key: "kanban", label: "Kanban", icon: LayoutGrid },
    { key: "table", label: "Table", icon: TableIcon },
    { key: "calendar", label: "Calendar", icon: CalendarIcon },
    { key: "timeline", label: "Timeline", icon: GitBranch },
  ];
  return (
    <div className="mt-6 grid grid-cols-1 gap-2.5 rounded-xl border border-border/70 bg-white p-2 shadow-xs lg:grid-cols-[auto_1fr_auto]">
      {/* view switcher */}
      <div className="flex h-9 items-center rounded-lg border border-border/70 bg-secondary/40 p-0.5">
        {views.map((v) => {
          const active = view === v.key;
          return (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`relative flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-semibold transition-all ${
                active ? "bg-white text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <v.icon className={`h-3.5 w-3.5 ${active ? "text-primary" : ""}`} />
              <span className="hidden sm:inline">{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* search */}
      <div className="group flex h-9 items-center gap-2 rounded-lg bg-secondary/50 px-3 transition-colors focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, key, or description…"
          className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/70"
        />
        {query && (
          <button onClick={() => setQuery("")} className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* filters */}
      <div className="flex items-center gap-2">
        <ChipBtn icon={<Filter className="h-3.5 w-3.5" />} label="Filter" badge="3" />
        <ChipBtn icon={<Flag className="h-3.5 w-3.5" />} label="Priority" caret />
        <ChipBtn icon={<ArrowUpDown className="h-3.5 w-3.5" />} label="Group: Status" caret />
        <div className="ml-1 flex -space-x-1.5">
          {Object.values(M).slice(0, 4).map((m, i) => (
            <span key={i} className="grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[9.5px] font-semibold text-white" style={{ background: m.color }}>{m.initials}</span>
          ))}
          <button className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-secondary text-muted-foreground hover:text-foreground">
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChipBtn({ icon, label, caret, badge }: { icon: React.ReactNode; label: string; caret?: boolean; badge?: string }) {
  return (
    <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-white px-2.5 text-[12px] font-semibold text-foreground shadow-xs hover:bg-secondary">
      {icon}<span className="hidden md:inline">{label}</span>
      {badge && <span className="rounded bg-primary/12 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{badge}</span>}
      {caret && <ChevronDown className="h-3 w-3 text-muted-foreground" />}
    </button>
  );
}

/* ============ KANBAN ============ */
function KanbanBoard({ tasks, setTasks, onOpen }: { tasks: Task[]; setTasks: (t: Task[]) => void; onOpen: (t: Task) => void }) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<StatusKey | null>(null);

  const byCol = (col: StatusKey) => tasks.filter((t) => t.status === col);

  const onDragStart = (id: string) => setDragId(id);
  const onDragEnd = () => { setDragId(null); setDragOver(null); };
  const onDropInto = (col: StatusKey) => {
    if (!dragId) return;
    setTasks(tasks.map((t) => (t.id === dragId ? { ...t, status: col } : t)));
    onDragEnd();
  };

  return (
    <div className="-mx-2 flex gap-4 overflow-x-auto px-2 pb-4">
      {COLUMNS.map((col) => {
        const items = byCol(col.key);
        const isOver = dragOver === col.key;
        return (
          <section
            key={col.key}
            onDragOver={(e) => { e.preventDefault(); setDragOver(col.key); }}
            onDragLeave={() => setDragOver((v) => (v === col.key ? null : v))}
            onDrop={() => onDropInto(col.key)}
            className={`flex w-[320px] shrink-0 flex-col rounded-2xl border transition-all ${
              isOver ? "border-primary/50 bg-primary/5 ring-4 ring-primary/10" : "border-border/70 bg-white/70"
            }`}
          >
            {/* column header */}
            <header className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
              <span className={`h-2 w-2 rounded-full ${col.dot}`} />
              <h3 className="text-[13px] font-semibold text-foreground">{col.title}</h3>
              <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{items.length}</span>
              <button className="ml-auto grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </header>

            {/* cards */}
            <div className="flex-1 space-y-2.5 p-3">
              {items.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  dragging={dragId === t.id}
                  onDragStart={() => onDragStart(t.id)}
                  onDragEnd={onDragEnd}
                  onOpen={() => onOpen(t)}
                />

              ))}
              {/* drop indicator */}
              <div className={`grid place-items-center rounded-xl border border-dashed py-3 text-[11.5px] font-medium transition-all ${
                isOver ? "border-primary/50 bg-primary/5 text-primary" : "border-border/70 text-muted-foreground/70 hover:border-primary/40 hover:text-foreground"
              }`}>
                <span className="flex items-center gap-1"><Plus className="h-3 w-3" /> {isOver ? "Drop here" : "Add task"}</span>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TaskCard({ task, dragging, onDragStart, onDragEnd, onOpen }: {
  task: Task; dragging: boolean; onDragStart: () => void; onDragEnd: () => void; onOpen: () => void;
}) {
  const priorityPill = ({
    Urgent: "bg-danger/12 text-danger",
    High: "bg-warning/15 text-warning",
    Medium: "bg-accent/15 text-accent-foreground",
    Low: "bg-secondary text-muted-foreground",
  } as Record<Priority, string>)[task.priority];
  const overdue = task.dueDay <= 25;
  const pct = task.checklist.total ? Math.round((task.checklist.done / task.checklist.total) * 100) : 0;

  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border border-border/70 bg-white p-3 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-float active:cursor-grabbing ${
        dragging ? "opacity-40 scale-[0.98] rotate-[-1.5deg]" : ""
      }`}
    >
      {/* left project stripe */}
      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: task.project.color }} />
      {/* drag handle */}
      <span className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-md text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100">
        <GripVertical className="h-3.5 w-3.5" />
      </span>

      {/* header row */}
      <div className="flex items-center gap-1.5 pl-1">
        <span className="rounded px-1 py-[1px] text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">{task.key}</span>
        <span className={`ml-auto flex items-center gap-0.5 rounded px-1.5 py-[1px] text-[9.5px] font-semibold ${priorityPill}`}>
          <Flag className="h-2.5 w-2.5" />
          {task.priority}
        </span>
      </div>

      {/* title */}
      <h4 className="mt-1 pl-1 text-[13px] font-semibold leading-snug text-foreground">{task.title}</h4>
      {task.description && (
        <p className="mt-1 pl-1 line-clamp-2 text-[11.5px] leading-relaxed text-muted-foreground">{task.description}</p>
      )}

      {/* tags */}
      {task.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1 pl-1">
          {task.tags.map((tg) => (
            <span key={tg.label} className={`rounded px-1.5 py-0.5 text-[9.5px] font-semibold ${tg.tone}`}>{tg.label}</span>
          ))}
        </div>
      )}

      {/* checklist progress */}
      {task.checklist.total > 0 && (
        <div className="mt-3 pl-1">
          <div className="flex items-center justify-between text-[10.5px]">
            <span className="flex items-center gap-1 font-medium text-muted-foreground">
              <CheckSquare className="h-3 w-3" />
              {task.checklist.done}/{task.checklist.total} subtasks
            </span>
            <span className="tabular-nums text-muted-foreground">{pct}%</span>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${task.project.color}, oklch(0.78 0.14 210))` }}
            />
          </div>
        </div>
      )}

      {/* footer */}
      <div className="mt-3 flex items-center gap-2 border-t border-border/50 pt-2.5 pl-1">
        <div className="flex -space-x-1.5">
          {task.members.slice(0, 3).map((m, i) => (
            <span key={i} className="grid h-5 w-5 place-items-center rounded-full border-2 border-white text-[8.5px] font-semibold text-white" style={{ background: m.color }}>{m.initials}</span>
          ))}
        </div>
        <span className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
          task.status === "done" ? "bg-success/12 text-success" : overdue ? "bg-danger/12 text-danger" : "bg-secondary text-foreground"
        }`}>
          <CalendarIcon className="h-2.5 w-2.5" />
          {task.due}
        </span>
        <div className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{task.comments}</span>
          <span className="flex items-center gap-0.5"><Paperclip className="h-3 w-3" />{task.attachments}</span>
        </div>
      </div>
    </article>
  );
}

/* ============ TABLE ============ */
function TableView({ tasks, onOpen }: { tasks: Task[]; onOpen: (t: Task) => void }) {
  const tone = (s: StatusKey) => ({
    todo: "bg-secondary text-foreground",
    in_progress: "bg-primary/12 text-primary",
    review: "bg-accent/15 text-accent-foreground",
    done: "bg-success/12 text-success",
  } as Record<StatusKey, string>)[s];
  const label = (s: StatusKey) => COLUMNS.find((c) => c.key === s)!.title;
  const pri = (p: Priority) => ({
    Urgent: "bg-danger/12 text-danger",
    High: "bg-warning/15 text-warning",
    Medium: "bg-accent/15 text-accent-foreground",
    Low: "bg-secondary text-muted-foreground",
  } as Record<Priority, string>)[p];

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left">
          <thead className="bg-secondary/30">
            <tr className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="py-2.5 pl-5 pr-3 w-8"></th>
              <th className="py-2.5 px-3">Task</th>
              <th className="py-2.5 px-3">Project</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Assignees</th>
              <th className="py-2.5 px-3">Subtasks</th>
              <th className="py-2.5 pl-3 pr-5">Due</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} onClick={() => onOpen(t)} className="cursor-pointer border-t border-border/50 text-[12.5px] transition-colors hover:bg-secondary/40">
                <td className="py-3 pl-5 pr-3"><input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-[oklch(0.55_0.22_279)]" /></td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{t.title}</p>
                      <p className="text-[10.5px] text-muted-foreground">{t.key}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/60 px-1.5 py-0.5 text-[11px] font-medium text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.project.color }} />
                    {t.project.name}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${tone(t.status)}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" /> {label(t.status)}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${pri(t.priority)}`}>
                    <Flag className="h-2.5 w-2.5" /> {t.priority}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex -space-x-1.5">
                    {t.members.map((m, i) => (
                      <span key={i} className="grid h-6 w-6 place-items-center rounded-full border-2 border-white text-[9.5px] font-semibold text-white" style={{ background: m.color }}>{m.initials}</span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${(t.checklist.done / Math.max(1, t.checklist.total)) * 100}%` }} />
                    </div>
                    <span className="text-[10.5px] tabular-nums text-muted-foreground">{t.checklist.done}/{t.checklist.total}</span>
                  </div>
                </td>
                <td className="pl-3 pr-5 py-3 tabular-nums text-muted-foreground">{t.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ============ CALENDAR ============ */
function CalendarView({ tasks }: { tasks: Task[] }) {
  // July 2026 starts on Wednesday
  const startOffset = 3;
  const daysInMonth = 31;
  const cells = 42;
  const today = 26;

  const tasksByDay = (d: number) => tasks.filter((t) => t.dueDay === d);

  return (
    <section className="rounded-2xl border border-border/70 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <h2 className="text-[15px] font-semibold">July 2026</h2>
          <div className="ml-2 flex items-center gap-1">
            <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary"><ChevronLeft className="h-3.5 w-3.5" /></button>
            <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary"><ChevronRight className="h-3.5 w-3.5" /></button>
            <button className="ml-1 rounded-md border border-border/70 bg-white px-2 py-1 text-[11px] font-semibold hover:bg-secondary">Today</button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-white p-0.5">
          {["Month", "Week", "Day"].map((v, i) => (
            <button key={v} className={`h-7 rounded-md px-2.5 text-[11px] font-semibold ${i === 0 ? "bg-secondary text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}>{v}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border/70 bg-secondary/30">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="px-3 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: cells }, (_, i) => {
          const day = i - startOffset + 1;
          const valid = day >= 1 && day <= daysInMonth;
          const isToday = day === today;
          const dayTasks = valid ? tasksByDay(day) : [];
          return (
            <div
              key={i}
              className={`relative min-h-[110px] border-b border-r border-border/50 p-2 transition-colors last:border-r-0 ${
                valid ? "bg-white hover:bg-secondary/30" : "bg-secondary/20"
              } ${(i + 1) % 7 === 0 ? "border-r-0" : ""}`}
            >
              {valid && (
                <>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className={`grid h-6 min-w-6 place-items-center rounded-md px-1 text-[11px] font-semibold ${
                      isToday ? "bg-gradient-primary text-white shadow-glow" : "text-foreground"
                    }`}>{day}</span>
                    {dayTasks.length > 0 && (
                      <span className="rounded bg-secondary px-1 py-0.5 text-[9.5px] font-semibold text-muted-foreground">{dayTasks.length}</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div key={t.id} className="group flex items-center gap-1.5 rounded-md border border-border/60 bg-white px-1.5 py-1 text-[10.5px] shadow-xs transition-transform hover:-translate-y-0.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: t.project.color }} />
                        <span className="truncate font-medium text-foreground">{t.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <button className="text-[10px] font-semibold text-primary hover:underline">+{dayTasks.length - 3} more</button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============ TIMELINE (Gantt) ============ */
function TimelineView({ tasks }: { tasks: Task[] }) {
  const days = 14; // Jul 20 → Aug 02
  const startDay = 20;
  const today = 26;
  const dayW = 60;

  const barFor = (t: Task) => {
    // synthesize a length from checklist total (1-4 days)
    const len = Math.max(2, Math.min(6, Math.ceil(t.checklist.total / 2)));
    const dueOffset = t.dueDay <= 31 ? t.dueDay - startDay : (31 - startDay) + t.dueDay;
    const end = Math.max(0, Math.min(days - 1, dueOffset));
    const start = Math.max(0, end - len);
    return { start, len: end - start + 1 };
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
        <div>
          <h2 className="text-[15px] font-semibold">Timeline</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Jul 20 → Aug 02 · 2 weeks</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-white p-0.5">
          {["Days","Weeks","Months"].map((v, i) => (
            <button key={v} className={`h-7 rounded-md px-2.5 text-[11px] font-semibold ${i === 0 ? "bg-secondary text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}>{v}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr]">
        {/* header row */}
        <div className="border-b border-r border-border/50 bg-secondary/30 px-4 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Task</div>
        <div className="overflow-x-auto">
          <div className="grid border-b border-border/50 bg-secondary/30" style={{ gridTemplateColumns: `repeat(${days}, ${dayW}px)`, minWidth: days * dayW }}>
            {Array.from({ length: days }, (_, i) => {
              const d = startDay + i > 31 ? startDay + i - 31 : startDay + i;
              const isToday = startDay + i === today;
              return (
                <div key={i} className={`border-r border-border/50 px-2 py-2 text-center text-[10.5px] font-semibold ${isToday ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                  <div className="uppercase tracking-wider">{["M","T","W","T","F","S","S"][(i + 0) % 7]}</div>
                  <div className="mt-0.5 text-foreground/80 tabular-nums">{d}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* rows */}
        {tasks.map((t) => {
          const b = barFor(t);
          return (
            <RowFragment key={t.id}>
              <div className="flex items-center gap-2 border-b border-r border-border/50 px-4 py-3">
                <span className="h-2 w-2 rounded-full" style={{ background: t.project.color }} />
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold text-foreground">{t.title}</p>
                  <p className="text-[10.5px] text-muted-foreground">{t.key}</p>
                </div>
              </div>
              <div className="relative overflow-x-auto border-b border-border/50">
                <div className="relative" style={{ width: days * dayW, height: 44 }}>
                  {/* today line */}
                  <div className="absolute inset-y-0 w-[2px] rounded bg-foreground/70" style={{ left: (today - startDay) * dayW + dayW / 2 }} />
                  {/* bar */}
                  <div
                    className="group absolute top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1 shadow-xs transition-transform hover:-translate-y-[calc(50%+2px)] hover:shadow-soft"
                    style={{
                      left: b.start * dayW + 6,
                      width: b.len * dayW - 12,
                      background: `linear-gradient(90deg, ${t.project.color}, oklch(0.78 0.14 210))`,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[11px] font-semibold text-white">{t.title}</span>
                      <div className="ml-auto flex -space-x-1">
                        {t.members.slice(0, 2).map((m, i) => (
                          <span key={i} className="grid h-4 w-4 place-items-center rounded-full border border-white/60 text-[8px] font-semibold text-white/95" style={{ background: m.color }}>{m.initials}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RowFragment>
          );
        })}
      </div>

      <div className="flex items-center gap-3 border-t border-border/70 px-5 py-2.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-gradient-primary" /> Task bar</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-[2px] bg-foreground/70" /> Today</span>
        <span className="ml-auto flex items-center gap-1"><Clock className="h-3 w-3" /> Auto-scheduled by AI</span>
      </div>
    </section>
  );
}

function RowFragment({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
