import { useEffect, useState, useMemo, useCallback } from "react";
import {
  X, Flag, Calendar as CalendarIcon, Users, Tag, Link2, Copy, MoreHorizontal,
  Sparkles, Paperclip, MessageSquare, CheckSquare, Activity, ChevronDown,
  Send, Smile, AtSign, ImageIcon, Plus, FileText, Download, Play, Circle,
  CheckCircle2, GitBranch, ArrowUpRight, Clock, Pin, ThumbsUp, Reply,
  Eye, Share2, Edit2, Trash2, Loader2, Check,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "@/features/comments/hooks";
import type { ApiComment } from "@/features/comments/api";
import { useTaskActivity } from "@/features/activity/hooks";
import type { ApiActivity } from "@/features/activity/api";

type Priority = "Urgent" | "High" | "Medium" | "Low";
type StatusKey = "todo" | "in_progress" | "review" | "done";
type Member = { initials: string; color: string; name: string; role?: string };

export type DrawerTask = {
  id: string;
  key: string;
  title: string;
  description?: string;
  status: StatusKey;
  priority: Priority;
  due: string;
  members: Member[];
  tags: { label: string; tone: string }[];
  checklist: { done: number; total: number };
  comments: number;
  attachments: number;
  project: { key: string; name: string; color: string };
};

/* ---------- fake data helpers for the drawer ---------- */
const richMembers: Member[] = [
  { initials: "AK", color: "oklch(0.72 0.16 180)", name: "Anya Kowalski", role: "Engineer" },
  { initials: "JL", color: "oklch(0.55 0.22 279)", name: "Jonas Lindqvist", role: "Design lead" },
  { initials: "MB", color: "oklch(0.75 0.16 92)", name: "Maya Brooks", role: "Product designer" },
  { initials: "SR", color: "oklch(0.68 0.17 28)", name: "Sana Ramírez", role: "Staff engineer" },
  { initials: "PS", color: "oklch(0.62 0.19 30)", name: "Priya Shah", role: "AI research" },
];

const subtasks = [
  { id: "s1", title: "Draft the endpoint contract", done: true, assignee: richMembers[3] },
  { id: "s2", title: "Add idempotency middleware", done: true, assignee: richMembers[0] },
  { id: "s3", title: "Backfill deduplication for existing rows", done: true, assignee: richMembers[3] },
  { id: "s4", title: "Emit metric for duplicate suppressions", done: false, assignee: richMembers[0] },
  { id: "s5", title: "Load-test at 5k rps sustained", done: false, assignee: richMembers[3] },
  { id: "s6", title: "Update SDK docs and changelog", done: false, assignee: richMembers[2] },
];

const attachments = [
  { id: "a1", name: "idempotency-design.pdf", size: "1.4 MB", kind: "pdf", by: "Sana", when: "Yesterday" },
  { id: "a2", name: "load-test-plan.md", size: "12 KB", kind: "md", by: "Anya", when: "2 days ago" },
  { id: "a3", name: "sequence-diagram.png", size: "480 KB", kind: "img", by: "Maya", when: "3 days ago" },
  { id: "a4", name: "walkthrough.mp4", size: "24.8 MB", kind: "video", by: "Jonas", when: "3 days ago" },
];

const comments = [
  {
    id: "c1",
    author: richMembers[3],
    time: "2h ago",
    body: "Draft is up. I kept the dedupe window at 24h — anything older re-runs. Curious what the payments folks think about that TTL.",
    reactions: [{ emoji: "👀", count: 4 }, { emoji: "🚀", count: 2 }],
    pinned: true,
    replies: [
      {
        id: "c1r1",
        author: richMembers[0],
        time: "1h ago",
        body: "24h feels right. We had one edge case last quarter where a 48h retry landed a double charge — let's document it in the SDK guide.",
      },
      {
        id: "c1r2",
        author: richMembers[4],
        time: "38m ago",
        body: "+1. I'll add a Copilot recipe that reminds folks to pass the key on retries.",
        ai: true,
      },
    ],
  },
  {
    id: "c2",
    author: richMembers[1],
    time: "4h ago",
    body: "Design nit: the toast copy should say 'Already processed' instead of 'Duplicate'. Feels calmer 🙂",
    reactions: [{ emoji: "💯", count: 3 }],
    replies: [],
  },
];

const activity = [
  { icon: CheckCircle2, tone: "text-success", who: "Sana", what: "marked 3 subtasks complete", when: "12m ago" },
  { icon: Paperclip, tone: "text-primary", who: "Jonas", what: "attached walkthrough.mp4", when: "3h ago" },
  { icon: MessageSquare, tone: "text-accent-foreground", who: "Anya", what: "commented on the dedupe TTL", when: "1h ago" },
  { icon: Flag, tone: "text-danger", who: "Priya", what: "raised priority from High → Urgent", when: "1d ago" },
  { icon: GitBranch, tone: "text-muted-foreground", who: "sana/PAY-151-idempotency", what: "branch opened", when: "2d ago" },
  { icon: Sparkles, tone: "text-primary", who: "Copilot", what: "summarized the spec into 6 subtasks", when: "2d ago" },
];

/* ================================================================ */
export function TaskDetailsDrawer({ task, onClose }: { task: DrawerTask | null; onClose: () => void }) {
  const { user } = useAuth();
  const [tab, setTab] = useState<"overview" | "activity">("overview");
  const [subs, setSubs] = useState(subtasks);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (task) {
      setTab("overview");
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = original; };
    }
  }, [task]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!task) return null;

  const priorityTone = ({
    Urgent: "bg-danger/12 text-danger ring-danger/25",
    High: "bg-warning/15 text-warning ring-warning/25",
    Medium: "bg-accent/15 text-accent-foreground ring-accent/25",
    Low: "bg-secondary text-muted-foreground ring-border",
  } as Record<Priority, string>)[task.priority];

  const statusMeta: Record<StatusKey, { label: string; tone: string; dot: string }> = {
    todo: { label: "Todo", tone: "bg-secondary text-foreground ring-border", dot: "bg-muted-foreground" },
    in_progress: { label: "In progress", tone: "bg-primary/12 text-primary ring-primary/25", dot: "bg-primary" },
    review: { label: "In review", tone: "bg-accent/15 text-accent-foreground ring-accent/25", dot: "bg-accent" },
    done: { label: "Done", tone: "bg-success/12 text-success ring-success/25", dot: "bg-success" },
  };
  const st = statusMeta[task.status];

  const doneCount = subs.filter((s) => s.done).length;
  const totalCount = subs.length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const toggleSub = (id: string) =>
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));

  return (
    <div className="fixed inset-0 z-[70]">
      {/* backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/25 backdrop-blur-sm animate-fade-in"
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-label={`Task ${task.key}`}
        className="absolute right-0 top-0 flex h-full w-full max-w-[860px] flex-col bg-[oklch(0.99_0.003_265)] shadow-float outline-none animate-slide-in-right"
      >
        {/* ============ header ============ */}
        <header className="relative flex-shrink-0 border-b border-border/60 bg-white">
          <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${task.project.color}, oklch(0.78 0.14 210))` }} />
          <div className="flex items-start gap-3 px-6 pt-5 pb-3.5">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl text-[11px] font-semibold text-white shadow-glow"
              style={{ background: `linear-gradient(135deg, ${task.project.color}, oklch(0.5 0.2 279))` }}
            >
              {task.project.key}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-[11.5px] font-medium text-muted-foreground">
                <span className="text-foreground">{task.project.name}</span>
                <span className="text-muted-foreground/50">/</span>
                <span className="rounded bg-secondary/70 px-1.5 py-[1px] font-mono text-[10.5px] tracking-wider text-foreground">{task.key}</span>
                <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 ring-1 ${st.tone}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} /> {st.label}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 ring-1 ${priorityTone}`}>
                  <Flag className="h-2.5 w-2.5" /> {task.priority}
                </span>
              </div>
              <h2 className="mt-1.5 text-[22px] font-semibold leading-tight tracking-[-0.01em] text-foreground">{task.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> 24 watching</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Updated 12m ago</span>
                <span className="inline-flex items-center gap-1"><GitBranch className="h-3 w-3" /> sana/PAY-151-idempotency</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <IconBtn label="Copy link"><Link2 className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn label="Share"><Share2 className="h-3.5 w-3.5" /></IconBtn>
              <IconBtn label="More"><MoreHorizontal className="h-3.5 w-3.5" /></IconBtn>
              <button
                onClick={onClose}
                className="ml-1 grid h-8 w-8 place-items-center rounded-lg border border-border/70 bg-white text-muted-foreground shadow-xs transition-all hover:bg-secondary hover:text-foreground"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* tabs */}
          <div className="flex items-center gap-1 px-6">
            {([
              { key: "overview" as const, label: "Overview" },
              { key: "activity" as const, label: "Activity" },
            ]).map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`relative h-9 px-2 text-[12.5px] font-semibold transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                  {active && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-gradient-primary" />}
                </button>
              );
            })}
          </div>
        </header>

        {/* ============ body ============ */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_320px]">
          {/* left/main column */}
          <div className="min-h-0 overflow-y-auto">
            <div className="space-y-8 px-6 py-6">
              {tab === "overview" ? (
                <>
                  <DescriptionSection task={task} />
                  <SubtasksSection
                    subs={subs}
                    onToggle={toggleSub}
                    doneCount={doneCount}
                    totalCount={totalCount}
                    pct={pct}
                  />
                  <AttachmentsSection />
                  <CommentsSection
                    taskId={task.id}
                    draft={draft}
                    setDraft={setDraft}
                    me={{
                      initials:
                        (user?.name ?? "You")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() || "ME",
                      color: "oklch(0.72 0.16 180)",
                      name: user?.name ?? "You",
                    }}
                  />
                </>
              ) : (
                <ActivitySection taskId={task.id} />
              )}
            </div>
          </div>

          {/* right/details column */}
          <aside className="min-h-0 overflow-y-auto border-t border-border/70 bg-white lg:border-l lg:border-t-0">
            <PropertiesPanel task={task} pct={pct} totalCount={totalCount} doneCount={doneCount} />
          </aside>
        </div>
      </aside>
    </div>
  );
}

/* ---------- header controls ---------- */
function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
    >
      {children}
    </button>
  );
}

/* ---------- section shell ---------- */
function Section({
  icon, title, meta, action, children,
}: {
  icon: React.ReactNode; title: string; meta?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-3 flex items-center gap-2.5">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-secondary/70 text-muted-foreground">{icon}</span>
        <h3 className="text-[13px] font-semibold tracking-[-0.005em] text-foreground">{title}</h3>
        {meta && <span className="text-[11px] text-muted-foreground">{meta}</span>}
        {action && <span className="ml-auto">{action}</span>}
      </header>
      {children}
    </section>
  );
}

/* ---------- Description ---------- */
function DescriptionSection({ task }: { task: DrawerTask }) {
  return (
    <Section
      icon={<FileText className="h-3.5 w-3.5" />}
      title="Description"
      action={
        <button className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-white px-2 py-1 text-[11px] font-semibold text-muted-foreground shadow-xs hover:bg-secondary hover:text-foreground">
          <Sparkles className="h-3 w-3 text-primary" /> Rewrite with AI
        </button>
      }
    >
      <div className="rounded-xl border border-border/60 bg-white p-4 leading-relaxed text-[13.5px] text-foreground shadow-xs">
        <p>
          {task.description ??
            "Every write endpoint should accept an X-Idempotency-Key header and return the cached response for repeated calls within a 24-hour window. This prevents accidental double writes during retries and gives SDKs a safe cancel/retry loop."}
        </p>
        <p className="mt-3 text-muted-foreground">
          Definition of done: contract published, middleware shipped behind a flag, backfill complete on the top-3 tenants, and a dedupe metric visible on the Payments dashboard.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {task.tags.map((t) => (
            <span key={t.label} className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${t.tone}`}>
              <Tag className="h-2.5 w-2.5" /> {t.label}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Subtasks ---------- */
function SubtasksSection({
  subs, onToggle, doneCount, totalCount, pct,
}: {
  subs: typeof subtasks; onToggle: (id: string) => void;
  doneCount: number; totalCount: number; pct: number;
}) {
  return (
    <Section
      icon={<CheckSquare className="h-3.5 w-3.5" />}
      title="Subtasks"
      meta={<span className="tabular-nums">{doneCount}/{totalCount} · {pct}%</span>}
      action={
        <button className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-white px-2 py-1 text-[11px] font-semibold text-muted-foreground shadow-xs hover:bg-secondary hover:text-foreground">
          <Plus className="h-3 w-3" /> Add subtask
        </button>
      }
    >
      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-secondary/70">
        <div className="h-full rounded-full bg-gradient-primary transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <ul className="overflow-hidden rounded-xl border border-border/60 bg-white shadow-xs">
        {subs.map((s, i) => (
          <li
            key={s.id}
            className={`group flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-secondary/40 ${
              i > 0 ? "border-t border-border/50" : ""
            }`}
          >
            <button
              onClick={() => onToggle(s.id)}
              className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-[1.5px] transition-all ${
                s.done ? "border-primary bg-gradient-primary text-white shadow-glow" : "border-border bg-white hover:border-primary"
              }`}
              aria-label={s.done ? "Mark incomplete" : "Mark complete"}
            >
              {s.done && <CheckCircle2 className="h-3 w-3" strokeWidth={3} />}
            </button>
            <span className={`min-w-0 flex-1 truncate text-[12.5px] font-medium ${s.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {s.title}
            </span>
            <span
              className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-semibold text-white ring-2 ring-white"
              style={{ background: s.assignee.color }}
              title={s.assignee.name}
            >
              {s.assignee.initials}
            </span>
            <button className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-secondary hover:text-foreground">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------- Attachments ---------- */
function AttachmentsSection() {
  return (
    <Section
      icon={<Paperclip className="h-3.5 w-3.5" />}
      title="Attachments"
      meta={<span>{attachments.length} files · 26.6 MB</span>}
      action={
        <button className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-white px-2 py-1 text-[11px] font-semibold text-muted-foreground shadow-xs hover:bg-secondary hover:text-foreground">
          <Plus className="h-3 w-3" /> Upload
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {attachments.map((a) => (
          <AttachmentTile key={a.id} a={a} />
        ))}
      </div>
      <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-white/50 py-3 text-[12px] font-medium text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary">
        <ImageIcon className="h-3.5 w-3.5" /> Drop files or paste to attach
      </label>
    </Section>
  );
}

function AttachmentTile({ a }: { a: (typeof attachments)[number] }) {
  const kindMeta: Record<string, { tint: string; icon: React.ReactNode }> = {
    pdf: { tint: "bg-danger/10 text-danger", icon: <FileText className="h-4 w-4" /> },
    md: { tint: "bg-primary/10 text-primary", icon: <FileText className="h-4 w-4" /> },
    img: { tint: "bg-warning/15 text-warning", icon: <ImageIcon className="h-4 w-4" /> },
    video: { tint: "bg-accent/15 text-accent-foreground", icon: <Play className="h-4 w-4" /> },
  };
  const m = kindMeta[a.kind] ?? kindMeta.md;
  return (
    <div className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-white p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${m.tint}`}>{m.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-semibold text-foreground">{a.name}</p>
        <p className="text-[10.5px] text-muted-foreground">{a.size} · {a.by} · {a.when}</p>
      </div>
      <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-secondary hover:text-foreground" aria-label="Download">
        <Download className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ---------- Helper Functions for Comments ---------- */
function formatTimeAgo(iso?: string): string {
  if (!iso) return "just now";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function wasEdited(createdAt?: string, updatedAt?: string): boolean {
  if (!createdAt || !updatedAt) return false;
  const created = new Date(createdAt).getTime();
  const updated = new Date(updatedAt).getTime();
  return updated - created > 3000;
}

function getAuthorInfo(c: ApiComment) {
  const authorObj = c.user ?? c.author ?? (typeof c.userId === "object" ? c.userId : {});
  const name = authorObj?.name ?? "Teammate";
  const initials = authorObj?.initials ?? (name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U");
  const color = authorObj?.color ?? "oklch(0.55 0.22 279)";
  const role = authorObj?.role ?? "Member";
  const avatarUrl = authorObj?.avatarUrl;
  return { name, initials, color, role, avatarUrl };
}

/* ---------- Comments Section ---------- */
function CommentsSection({
  taskId,
  draft,
  setDraft,
  me,
}: {
  taskId: string;
  draft: string;
  setDraft: (v: string) => void;
  me: Member;
}) {
  const { data: rawComments = [], isLoading, isError, error } = useComments(taskId);
  const createComment = useCreateComment(taskId);
  const updateComment = useUpdateComment(taskId);
  const deleteComment = useDeleteComment(taskId);

  const [sortOrder, setSortOrder] = useState<"Newest" | "Oldest">("Newest");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Group top-level comments and child replies
  const rootComments = useMemo(() => {
    return rawComments.filter((c) => !c.parentId);
  }, [rawComments]);

  const getReplies = useCallback(
    (parentId: string) => {
      const target = rawComments.find((c) => (c._id ?? c.id) === parentId);
      if (target?.replies && target.replies.length > 0) return target.replies;
      return rawComments.filter((c) => c.parentId === parentId);
    },
    [rawComments]
  );

  const sortedRootComments = useMemo(() => {
    const list = [...rootComments];
    list.sort((a, b) => {
      const timeA = new Date(a.createdAt ?? 0).getTime();
      const timeB = new Date(b.createdAt ?? 0).getTime();
      return sortOrder === "Newest" ? timeB - timeA : timeA - timeB;
    });
    return list;
  }, [rootComments, sortOrder]);

  const totalMessageCount = rawComments.length;

  async function handleSend() {
    if (!draft.trim()) return;
    setErrorMsg(null);
    try {
      await createComment.mutateAsync({
        content: draft.trim(),
        parentId: replyParentId ?? undefined,
      });
      setDraft("");
      setReplyParentId(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to post comment");
    }
  }

  async function handleSaveEdit(commentId: string) {
    if (!editContent.trim()) return;
    setErrorMsg(null);
    try {
      await updateComment.mutateAsync({
        commentId,
        input: { content: editContent.trim() },
      });
      setEditingId(null);
      setEditContent("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update comment");
    }
  }

  async function handleDelete(commentId: string) {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setErrorMsg(null);
    try {
      await deleteComment.mutateAsync(commentId);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete comment");
    }
  }

  function startEditing(c: ApiComment) {
    const id = c._id ?? c.id;
    setEditingId(id);
    setEditContent(c.content ?? c.body ?? c.text ?? "");
  }

  return (
    <Section
      icon={<MessageSquare className="h-3.5 w-3.5" />}
      title="Comments"
      meta={<span>{totalMessageCount} messages</span>}
      action={
        <div className="flex items-center gap-1 rounded-md border border-border/70 bg-white p-0.5">
          {(["Newest", "Oldest"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setSortOrder(v)}
              className={`h-6 rounded px-2 text-[10.5px] font-semibold transition-colors ${
                sortOrder === v ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      }
    >
      {/* Validation / error message */}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12px] font-medium text-destructive">
          {errorMsg}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-3 py-4">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-secondary/80" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-1/3 rounded bg-secondary/80" />
              <div className="h-3 w-2/3 rounded bg-secondary/60" />
            </div>
          </div>
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-secondary/80" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-1/4 rounded bg-secondary/80" />
              <div className="h-3 w-1/2 rounded bg-secondary/60" />
            </div>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center text-[12.5px] font-medium text-destructive">
          {error instanceof Error ? error.message : "Failed to load comments."}
        </div>
      ) : sortedRootComments.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-border/70 p-6 text-center">
          <MessageSquare className="mx-auto h-6 w-6 text-muted-foreground/60" />
          <p className="mt-2 text-[13px] font-medium text-foreground">No comments yet</p>
          <p className="mt-0.5 text-[11.5px] text-muted-foreground">
            Be the first to leave a comment on this task.
          </p>
        </div>
      ) : (
        /* Thread */
        <ol className="space-y-4">
          {sortedRootComments.map((c) => {
            const commentId = c._id ?? c.id;
            const replies = getReplies(commentId);
            return (
              <li key={commentId}>
                <CommentItem
                  c={c}
                  isEditing={editingId === commentId}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  onSaveEdit={() => handleSaveEdit(commentId)}
                  onCancelEdit={() => setEditingId(null)}
                  onStartEdit={() => startEditing(c)}
                  onDelete={() => handleDelete(commentId)}
                  onReply={() => setReplyParentId(commentId)}
                  isSavingEdit={updateComment.isPending}
                />

                {replies.length > 0 && (
                  <ol className="mt-3 space-y-3 border-l-2 border-border/50 pl-4 ml-5">
                    {replies.map((r) => {
                      const replyId = r._id ?? r.id;
                      return (
                        <li key={replyId}>
                          <CommentItem
                            c={r}
                            isReply
                            isEditing={editingId === replyId}
                            editContent={editContent}
                            setEditContent={setEditContent}
                            onSaveEdit={() => handleSaveEdit(replyId)}
                            onCancelEdit={() => setEditingId(null)}
                            onStartEdit={() => startEditing(r)}
                            onDelete={() => handleDelete(replyId)}
                            isSavingEdit={updateComment.isPending}
                          />
                        </li>
                      );
                    })}
                  </ol>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {/* Replying banner */}
      {replyParentId && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11.5px]">
          <span className="font-semibold text-primary">Replying to thread…</span>
          <button
            onClick={() => setReplyParentId(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Composer */}
      <div className="mt-5 overflow-hidden rounded-xl border border-border/60 bg-white shadow-xs transition-shadow focus-within:shadow-soft focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
        <div className="flex items-start gap-3 p-3">
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[9.5px] font-semibold text-white"
            style={{ background: me.color }}
          >
            {me.initials}
          </span>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
            placeholder="Leave a comment, @mention teammates, or / for commands…"
            className="min-h-[44px] flex-1 resize-none bg-transparent text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </div>
        <div className="flex items-center gap-1 border-t border-border/50 bg-secondary/30 px-2 py-1.5">
          <ComposerBtn><Paperclip className="h-3.5 w-3.5" /></ComposerBtn>
          <ComposerBtn><AtSign className="h-3.5 w-3.5" /></ComposerBtn>
          <ComposerBtn><Smile className="h-3.5 w-3.5" /></ComposerBtn>
          <ComposerBtn><ImageIcon className="h-3.5 w-3.5" /></ComposerBtn>
          <button className="ml-1 inline-flex h-7 items-center gap-1 rounded-md bg-secondary px-2 text-[10.5px] font-semibold text-foreground hover:bg-secondary/70">
            <Sparkles className="h-3 w-3 text-primary" /> Draft with AI
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">
              <kbd className="rounded bg-white px-1 py-[1px] font-mono text-[9.5px] text-muted-foreground ring-1 ring-border">⌘</kbd>
              <span className="mx-0.5">+</span>
              <kbd className="rounded bg-white px-1 py-[1px] font-mono text-[9.5px] text-muted-foreground ring-1 ring-border">↵</kbd>
              to send
            </span>
            <button
              onClick={handleSend}
              disabled={!draft.trim() || createComment.isPending}
              className="inline-flex h-7 items-center gap-1 rounded-md bg-gradient-primary px-2.5 text-[11.5px] font-semibold text-white shadow-glow transition-all hover:scale-[1.02] disabled:opacity-50 disabled:shadow-none"
            >
              {createComment.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
              Comment
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ComposerBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-white hover:text-foreground">
      {children}
    </button>
  );
}

function CommentItem({
  c,
  isReply = false,
  isEditing = false,
  editContent,
  setEditContent,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
  onDelete,
  onReply,
  isSavingEdit = false,
}: {
  c: ApiComment;
  isReply?: boolean;
  isEditing?: boolean;
  editContent?: string;
  setEditContent?: (v: string) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onStartEdit?: () => void;
  onDelete?: () => void;
  onReply?: () => void;
  isSavingEdit?: boolean;
}) {
  const author = getAuthorInfo(c);
  const contentText = c.content ?? c.body ?? c.text ?? "";
  const timeAgo = formatTimeAgo(c.createdAt);
  const edited = wasEdited(c.createdAt, c.updatedAt);

  return (
    <article
      className={`group relative rounded-xl border bg-white p-3.5 shadow-xs transition-shadow hover:shadow-soft ${
        c.pinned ? "border-warning/30 ring-1 ring-warning/15" : "border-border/60"
      }`}
    >
      {c.pinned && (
        <span className="absolute -top-2 left-3 inline-flex items-center gap-1 rounded-full bg-warning/15 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-warning ring-1 ring-warning/30">
          <Pin className="h-2.5 w-2.5" /> Pinned
        </span>
      )}
      <div className="flex items-start gap-3">
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="h-8 w-8 shrink-0 rounded-full object-cover shadow-xs"
          />
        ) : (
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white shadow-xs"
            style={{ background: author.color }}
          >
            {author.initials}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[12.5px] font-semibold text-foreground">{author.name}</span>
            <span className="text-[10.5px] text-muted-foreground">{author.role}</span>
            <span className="text-[10.5px] text-muted-foreground">· {timeAgo}</span>
            {edited && (
              <span className="text-[10px] italic text-muted-foreground/80">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent?.(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border/70 bg-surface px-3 py-2 text-[13px] text-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={onSaveEdit}
                  disabled={isSavingEdit || !editContent?.trim()}
                  className="inline-flex h-7 items-center gap-1 rounded-md bg-gradient-primary px-2.5 text-[11px] font-semibold text-white shadow-xs hover:opacity-90 disabled:opacity-50"
                >
                  {isSavingEdit ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Save
                </button>
                <button
                  onClick={onCancelEdit}
                  className="h-7 rounded-md border border-border/70 px-2.5 text-[11px] font-medium hover:bg-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-foreground">
              {contentText}
            </p>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {onReply && (
              <IconBtn label="Reply" onClick={onReply}>
                <Reply className="h-3.5 w-3.5" />
              </IconBtn>
            )}
            {onStartEdit && (
              <IconBtn label="Edit" onClick={onStartEdit}>
                <Edit2 className="h-3.5 w-3.5" />
              </IconBtn>
            )}
            {onDelete && (
              <IconBtn label="Delete" onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconBtn>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------- Activity Helper Functions ---------- */
function getActivityInfo(e: ApiActivity) {
  const userObj = e.user ?? e.author ?? (typeof e.userId === "object" ? e.userId : {});
  const who = e.userName ?? userObj?.name ?? "Teammate";
  const initials = e.userInitials ?? userObj?.initials ?? (who.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U");
  const color = e.userColor ?? userObj?.color ?? "oklch(0.55 0.22 279)";
  const avatarUrl = userObj?.avatarUrl;

  const type = (e.type ?? e.action ?? "").toUpperCase();
  const details = e.details ?? e.metadata ?? {};

  let what = e.message ?? e.description ?? "";
  let icon = Activity;
  let tone = "text-muted-foreground";

  switch (type) {
    case "TASK_CREATED":
      icon = Sparkles;
      tone = "text-primary";
      if (!what) {
        const title = details.title ? ` "${details.title}"` : "";
        what = `created task${title}`;
      }
      break;

    case "TASK_STATUS_CHANGED":
      icon = CheckCircle2;
      tone = "text-success";
      if (!what) {
        const from = details.from ?? details.oldValue;
        const to = details.to ?? details.newValue;
        if (from && to) {
          what = `changed status from ${from} to ${to}`;
        } else if (to) {
          what = `changed status to ${to}`;
        } else {
          what = `updated task status`;
        }
      }
      break;

    case "TASK_UPDATED":
      icon = Edit2;
      tone = "text-accent-foreground";
      if (!what) {
        if (details.field) {
          what = `updated ${details.field}`;
        } else {
          what = `updated task details`;
        }
      }
      break;

    case "TASK_DELETED":
      icon = Trash2;
      tone = "text-danger";
      if (!what) {
        const title = details.title ? ` "${details.title}"` : "";
        what = `deleted task${title}`;
      }
      break;

    default:
      if (!what) {
        what = type ? type.toLowerCase().replace(/_/g, " ") : "updated task";
      }
      break;
  }

  const when = formatTimeAgo(e.createdAt ?? e.timestamp ?? e.updatedAt);

  return { who, initials, color, avatarUrl, what, when, icon, tone };
}

/* ---------- Activity ---------- */
function ActivitySection({ taskId }: { taskId: string }) {
  const { data: rawActivities = [], isLoading, isError, error } = useTaskActivity(taskId);

  return (
    <Section
      icon={<Activity className="h-3.5 w-3.5" />}
      title="Activity"
      meta={<span>{rawActivities.length} events</span>}
      action={
        <button className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-white px-2 py-1 text-[11px] font-semibold text-muted-foreground shadow-xs hover:bg-secondary hover:text-foreground">
          All events <ChevronDown className="h-3 w-3" />
        </button>
      }
    >
      {isLoading ? (
        <div className="space-y-3 py-3 pl-2">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-6 w-6 rounded-full bg-secondary/80" />
            <div className="h-4 w-2/3 rounded bg-secondary/70" />
          </div>
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-6 w-6 rounded-full bg-secondary/80" />
            <div className="h-4 w-1/2 rounded bg-secondary/60" />
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center text-[12.5px] font-medium text-destructive">
          {error instanceof Error ? error.message : "Failed to load activity timeline."}
        </div>
      ) : rawActivities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 p-6 text-center">
          <Activity className="mx-auto h-6 w-6 text-muted-foreground/60" />
          <p className="mt-2 text-[13px] font-medium text-foreground">No activity recorded yet</p>
          <p className="mt-0.5 text-[11.5px] text-muted-foreground">
            Changes to this task will appear here.
          </p>
        </div>
      ) : (
        <ol className="relative space-y-4 pl-6">
          <span className="absolute left-[11px] top-1.5 bottom-1.5 w-px bg-border/60" />
          {rawActivities.map((e, i) => {
            const info = getActivityInfo(e);
            const Icon = info.icon;
            const key = e._id ?? e.id ?? `act-${i}`;
            return (
              <li key={key} className="relative">
                <span className={`absolute -left-[18px] top-0.5 grid h-6 w-6 place-items-center rounded-full bg-white ring-2 ring-white shadow-xs ${info.tone}`}>
                  <Icon className="h-3 w-3" />
                </span>
                <div className="rounded-lg border border-border/60 bg-white px-3 py-2 shadow-xs">
                  <p className="text-[12.5px] leading-snug text-foreground">
                    <span className="font-semibold">{info.who}</span>{" "}
                    <span className="text-muted-foreground">{info.what}</span>
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-muted-foreground">{info.when}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Section>
  );
}

/* ---------- Right column: Properties ---------- */
function PropertiesPanel({
  task, pct, totalCount, doneCount,
}: { task: DrawerTask; pct: number; totalCount: number; doneCount: number }) {
  return (
    <div className="space-y-6 px-5 py-6">
      {/* AI summary card */}
      <div className="overflow-hidden rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.06] to-accent/[0.06] p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-primary text-white shadow-glow">
            <Sparkles className="h-3 w-3" />
          </span>
          <h4 className="text-[12.5px] font-semibold text-foreground">Copilot summary</h4>
        </div>
        <p className="mt-2 text-[11.5px] leading-relaxed text-foreground/85">
          On track. 3 of 6 subtasks shipped; the remaining load test is the biggest risk before the {task.due} due date.
        </p>
        <button className="mt-2.5 inline-flex items-center gap-1 text-[10.5px] font-semibold text-primary hover:underline">
          Suggest next actions <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      <PropertyRow label="Status">
        <SelectPill>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> In progress
        </SelectPill>
      </PropertyRow>

      <PropertyRow label="Priority" icon={<Flag className="h-3.5 w-3.5" />}>
        <SelectPill className="bg-danger/12 text-danger ring-danger/20">
          <Flag className="h-3 w-3" /> {task.priority}
        </SelectPill>
      </PropertyRow>

      <PropertyRow label="Due date" icon={<CalendarIcon className="h-3.5 w-3.5" />}>
        <SelectPill><CalendarIcon className="h-3 w-3" /> {task.due}</SelectPill>
        <p className="mt-1 text-[10.5px] text-muted-foreground">3 days remaining</p>
      </PropertyRow>

      <PropertyRow label="Assignees" icon={<Users className="h-3.5 w-3.5" />}>
        <ul className="space-y-1.5">
          {richMembers.slice(0, 3).map((m) => (
            <li key={m.initials} className="flex items-center gap-2 rounded-md p-1 hover:bg-secondary/50">
              <span className="grid h-6 w-6 place-items-center rounded-full text-[9.5px] font-semibold text-white" style={{ background: m.color }}>{m.initials}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-foreground">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">{m.role}</p>
              </div>
            </li>
          ))}
          <li>
            <button className="mt-0.5 flex w-full items-center gap-2 rounded-md p-1 text-[11.5px] font-semibold text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-dashed border-border text-muted-foreground"><Plus className="h-3 w-3" /></span>
              Add assignee
            </button>
          </li>
        </ul>
      </PropertyRow>

      <PropertyRow label="Tags" icon={<Tag className="h-3.5 w-3.5" />}>
        <div className="flex flex-wrap gap-1.5">
          {task.tags.map((t) => (
            <span key={t.label} className={`rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${t.tone}`}>{t.label}</span>
          ))}
          <button className="rounded-md border border-dashed border-border px-1.5 py-0.5 text-[10.5px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary">+ Add</button>
        </div>
      </PropertyRow>

      <PropertyRow label="Progress">
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/70">
            <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${pct}%` }} />
          </div>
          <span className="tabular-nums text-[11px] font-semibold text-foreground">{pct}%</span>
        </div>
        <p className="mt-1 text-[10.5px] text-muted-foreground">{doneCount} of {totalCount} subtasks complete</p>
      </PropertyRow>

      <PropertyRow label="Project">
        <button className="inline-flex items-center gap-1.5 rounded-md bg-secondary/70 px-2 py-1 text-[11.5px] font-semibold text-foreground hover:bg-secondary">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: task.project.color }} /> {task.project.name}
        </button>
      </PropertyRow>

      <PropertyRow label="Linked">
        <ul className="space-y-1.5 text-[11.5px]">
          <li className="flex items-center gap-1.5 text-foreground">
            <GitBranch className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-[11px]">sana/PAY-151</span>
            <span className="text-muted-foreground">· open</span>
          </li>
          <li className="flex items-center gap-1.5 text-foreground">
            <Circle className="h-3 w-3 text-muted-foreground" />
            <span>Blocks <span className="font-semibold">PAY-160</span></span>
          </li>
          <li className="flex items-center gap-1.5 text-foreground">
            <Circle className="h-3 w-3 text-muted-foreground" />
            <span>Related to <span className="font-semibold">SEC-04</span></span>
          </li>
        </ul>
      </PropertyRow>

      <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 text-[10.5px] leading-relaxed text-muted-foreground">
        Created by <span className="font-semibold text-foreground">Priya Shah</span> · 6 days ago
        <br />
        Last activity 12 minutes ago
      </div>

      <button className="w-full rounded-lg border border-border/70 bg-white py-2 text-[11.5px] font-semibold text-muted-foreground shadow-xs hover:bg-secondary hover:text-foreground">
        Copy task ID · <span className="font-mono">{task.key}</span>
      </button>
    </div>
  );
}

function PropertyRow({
  label, icon, children,
}: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}<span>{label}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SelectPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-semibold text-foreground ring-1 ring-border/70 transition-colors hover:bg-secondary/70 ${className ?? "bg-secondary/50"}`}>
      {children}
      <ChevronDown className="h-3 w-3 opacity-60" />
    </button>
  );
}
