import React, { useState } from 'react';
import {
  Plus, MoreHorizontal, Calendar, LayoutGrid, List, Table2,
  Paperclip, MessageSquare, SlidersHorizontal, ArrowUpDown, User,
} from 'lucide-react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Task, TaskStatus } from '../types/task';

/* ── Sample data ── */
const SAMPLE_TASKS: Task[] = [
  { _id: '1', title: 'Monthly Product Discussion', tags: ['Internal', 'Marketing', 'Urgent'], status: 'planned', priority: 'urgent', dueDate: '2023-01-24', subtasks: { done: 10, total: 124 }, assignees: ['A', 'B', 'C'], attachments: 5, comments: 19, createdAt: '', updatedAt: '' },
  { _id: '2', title: 'Update New Social Media Post', tags: ['Marketing', 'Event', 'Urgent'], status: 'planned', priority: 'urgent', dueDate: '2023-01-18', subtasks: { done: 12, total: 52 }, assignees: ['A', 'B', 'C'], attachments: 1, comments: 1, createdAt: '', updatedAt: '' },
  { _id: '3', title: 'Input Data for Monthly Sales Revenue', tags: ['Internal', 'Document', 'Marketing'], status: 'planned', priority: 'medium', dueDate: '2023-01-31', subtasks: { done: 4, total: 5 }, assignees: ['A', 'B'], attachments: 2, comments: 0, createdAt: '', updatedAt: '' },
  { _id: '4', title: 'Create Monthly Revenue Recap for All Product Linear', tags: ['Report', 'Event', 'Urgent'], status: 'upcoming', priority: 'urgent', dueDate: '2023-01-11', subtasks: { done: 4, total: 12 }, assignees: ['A', 'B'], attachments: 0, comments: 1, createdAt: '', updatedAt: '' },
  { _id: '5', title: 'Uploading New Items to Marketplace', tags: ['Report', 'Document', 'Marketing'], status: 'upcoming', priority: 'medium', dueDate: '2023-01-09', subtasks: { done: 12, total: 64 }, assignees: ['A', 'B', 'C'], attachments: 1, comments: 23, createdAt: '', updatedAt: '' },
  { _id: '6', title: 'Monthly Product Discussion', tags: ['Internal', 'Marketing', 'Urgent'], status: 'upcoming', priority: 'urgent', dueDate: '2023-01-12', subtasks: { done: 3, total: 4 }, assignees: ['A', 'B', 'C', 'D'], attachments: 2, comments: 51, createdAt: '', updatedAt: '' },
  { _id: '7', title: 'Update New Social Media Post', tags: ['Marketing', 'Event', 'Urgent'], status: 'upcoming', priority: 'urgent', dueDate: '2023-01-15', subtasks: { done: 0, total: 12 }, assignees: ['A', 'B', 'C'], attachments: 4, comments: 3, createdAt: '', updatedAt: '' },
  { _id: '8', title: 'Input Data for Monthly Sales Revenue', tags: ['Marketing', 'Event', 'Urgent'], status: 'upcoming', priority: 'urgent', dueDate: '2023-01-15', subtasks: { done: 3, total: 4 }, assignees: ['A'], attachments: 1, comments: 15, createdAt: '', updatedAt: '' },
  { _id: '9', title: 'Uploading New Items to Marketplace', tags: ['Report', 'Document', 'Marketing'], status: 'completed', priority: 'medium', dueDate: '2023-01-09', subtasks: { done: 2, total: 15 }, assignees: ['A', 'B'], attachments: 12, comments: 1, createdAt: '', updatedAt: '' },
  { _id: '10', title: 'Input Data for Monthly Sales Revenue', tags: ['Internal', 'Document', 'Marketing'], status: 'completed', priority: 'medium', dueDate: '2023-01-13', subtasks: { done: 1, total: 53 }, assignees: ['A', 'B'], attachments: 2, comments: 21, createdAt: '', updatedAt: '' },
];

const TAG_COLORS: Record<string, string> = {
  Internal: 'bg-amber-100 text-amber-700',
  Marketing: 'bg-purple-100 text-purple-700',
  Urgent: 'bg-red-100 text-red-600',
  Report: 'bg-green-100 text-green-700',
  Event: 'bg-blue-100 text-blue-700',
  Document: 'bg-indigo-100 text-indigo-700',
  Badge: 'bg-pink-100 text-pink-700',
};

const COLUMN_META: Record<TaskStatus, { label: string; color: string; dot: string }> = {
  planned:   { label: 'Planned',   color: 'text-amber-600',  dot: 'bg-amber-400' },
  upcoming:  { label: 'Upcoming',  color: 'text-blue-600',   dot: 'bg-blue-500' },
  completed: { label: 'Completed', color: 'text-green-600',  dot: 'bg-green-500' },
};

/* ── Assignee avatars ── */
const Avatars: React.FC<{ assignees?: string[] }> = ({ assignees = [] }) => (
  <div className="flex -space-x-1.5">
    {assignees.slice(0, 4).map((_, i) => (
      <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center">
        <User size={9} className="text-primary" />
      </div>
    ))}
  </div>
);

/* ── Tag chips ── */
const Tags: React.FC<{ tags: string[] }> = ({ tags }) => (
  <div className="flex flex-wrap gap-1">
    {tags.map((tag) => (
      <span key={tag} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${TAG_COLORS[tag] ?? 'bg-gray-100 text-gray-600'}`}>
        {tag}
      </span>
    ))}
  </div>
);

/* ── Kanban card ── */
const KanbanCard: React.FC<{ task: Task; onMove: (id: string, status: TaskStatus) => void }> = ({ task, onMove }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const statuses: TaskStatus[] = ['planned', 'upcoming', 'completed'];

  return (
    <div className="bg-white rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Tags tags={task.tags} />
        <div className="relative shrink-0">
          <button onClick={() => setMenuOpen((v) => !v)} className="text-text-muted hover:text-text-primary transition">
            <MoreHorizontal size={15} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-6 z-20 w-40 bg-white rounded-xl border border-border shadow-dropdown py-1">
                {statuses.filter((s) => s !== task.status).map((s) => (
                  <button key={s} onClick={() => { setMenuOpen(false); onMove(task._id, s); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-primary hover:bg-background transition capitalize">
                    Move to {COLUMN_META[s].label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-sm font-semibold text-text-primary leading-snug">{task.title}</p>

      <div className="flex items-center gap-3 text-xs text-text-muted">
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            Due Date {new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        )}
        {task.subtasks && (
          <span className="flex items-center gap-1 ml-auto">
            <LayoutGrid size={11} /> {task.subtasks.done}/{task.subtasks.total}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Avatars assignees={task.assignees} />
        <div className="flex items-center gap-2.5 text-xs text-text-muted">
          {task.attachments !== undefined && (
            <span className="flex items-center gap-1"><Paperclip size={11} /> {task.attachments}</span>
          )}
          {task.comments !== undefined && (
            <span className="flex items-center gap-1"><MessageSquare size={11} /> {task.comments}</span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Kanban column ── */
const KanbanColumn: React.FC<{
  status: TaskStatus;
  tasks: Task[];
  onMove: (id: string, status: TaskStatus) => void;
  onAdd: (status: TaskStatus) => void;
}> = ({ status, tasks, onMove, onAdd }) => {
  const meta = COLUMN_META[status];
  return (
    <div className="flex flex-col gap-3 min-w-[300px] flex-1">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
        <h3 className={`text-base font-bold ${meta.color}`}>{meta.label}</h3>
        <span className="text-xs text-text-muted ml-1">
          {tasks.length} {status === 'completed' ? 'completed' : 'open'} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <button
        onClick={() => onAdd(status)}
        className="flex items-center justify-center gap-2 h-10 rounded-xl border border-dashed border-border text-sm text-text-secondary hover:bg-white hover:border-primary hover:text-primary transition"
      >
        <Plus size={14} /> Create Task
      </button>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <KanbanCard key={task._id} task={task} onMove={onMove} />
        ))}
      </div>
    </div>
  );
};

/* ── List view ── */
const ListView: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
  <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border bg-background/50">
          <th className="table-th">Title</th>
          <th className="table-th">Tags</th>
          <th className="table-th">Status</th>
          <th className="table-th hidden md:table-cell">Due Date</th>
          <th className="table-th hidden lg:table-cell">Subtasks</th>
          <th className="table-th hidden lg:table-cell">Assignees</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {tasks.map((task) => {
          const meta = COLUMN_META[task.status];
          return (
            <tr key={task._id} className="hover:bg-background/60 transition">
              <td className="table-td font-medium text-text-primary max-w-[220px]">
                <p className="truncate">{task.title}</p>
              </td>
              <td className="table-td"><Tags tags={task.tags} /></td>
              <td className="table-td">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  task.status === 'upcoming'  ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </td>
              <td className="table-td hidden md:table-cell text-text-secondary text-xs">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
              </td>
              <td className="table-td hidden lg:table-cell text-text-secondary text-xs">
                {task.subtasks ? `${task.subtasks.done}/${task.subtasks.total}` : '—'}
              </td>
              <td className="table-td hidden lg:table-cell">
                <Avatars assignees={task.assignees} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

/* ── Table view (grouped) ── */
const TableView: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
  <div className="flex flex-col gap-6">
    {(['planned', 'upcoming', 'completed'] as TaskStatus[]).map((status) => {
      const group = tasks.filter((t) => t.status === status);
      if (!group.length) return null;
      const meta = COLUMN_META[status];
      return (
        <div key={status} className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className={`flex items-center gap-2 px-5 py-3 border-b border-border`}>
            <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
            <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
            <span className="text-xs text-text-muted">({group.length})</span>
          </div>
          <table className="w-full">
            <tbody className="divide-y divide-border">
              {group.map((task) => (
                <tr key={task._id} className="hover:bg-background/60 transition">
                  <td className="table-td font-medium text-text-primary w-1/3">
                    <p className="truncate">{task.title}</p>
                  </td>
                  <td className="table-td"><Tags tags={task.tags} /></td>
                  <td className="table-td hidden md:table-cell text-text-secondary text-xs">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="table-td hidden lg:table-cell">
                    <Avatars assignees={task.assignees} />
                  </td>
                  <td className="table-td hidden lg:table-cell text-text-muted text-xs">
                    <span className="flex items-center gap-1"><Paperclip size={11} /> {task.attachments ?? 0}</span>
                  </td>
                  <td className="table-td hidden lg:table-cell text-text-muted text-xs">
                    <span className="flex items-center gap-1"><MessageSquare size={11} /> {task.comments ?? 0}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    })}
  </div>
);

/* ── Main ── */
type ViewMode = 'list' | 'kanban' | 'table';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [view, setView] = useState<ViewMode>('kanban');

  const moveTask = (id: string, status: TaskStatus) =>
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)));

  const addTask = (status: TaskStatus) => {
    const title = prompt('Task title:');
    if (!title?.trim()) return;
    const newTask: Task = {
      _id: Date.now().toString(),
      title: title.trim(),
      tags: [],
      status,
      priority: 'medium',
      assignees: [],
      attachments: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const viewTabs: { key: ViewMode; icon: React.ReactNode; label: string }[] = [
    { key: 'list',   icon: <List size={14} />,    label: 'List' },
    { key: 'kanban', icon: <LayoutGrid size={14} />, label: 'Kanban' },
    { key: 'table',  icon: <Table2 size={14} />,  label: 'Table' },
  ];

  return (
    <Layout>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold text-text-primary">Task</h1>
          <div className="flex items-center gap-1 border-b border-border">
            {viewTabs.map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition border-b-2 -mb-px ${
                  view === key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 h-9 px-3 text-sm text-text-secondary border border-border rounded-lg hover:bg-white transition">
            <ArrowUpDown size={14} /> Sort By
          </button>
          <button className="flex items-center gap-1.5 h-9 px-3 text-sm text-text-secondary border border-border rounded-lg hover:bg-white transition">
            <SlidersHorizontal size={14} /> Filter
          </button>
          <Button icon={<Plus size={15} />} onClick={() => addTask('planned')}>Add Task</Button>
        </div>
      </div>

      {/* ── Content ── */}
      {view === 'kanban' && (
        <div className="flex gap-5 overflow-x-auto pb-4">
          {(['planned', 'upcoming', 'completed'] as TaskStatus[]).map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
              onMove={moveTask}
              onAdd={addTask}
            />
          ))}
        </div>
      )}

      {view === 'list' && <ListView tasks={tasks} />}
      {view === 'table' && <TableView tasks={tasks} />}
    </Layout>
  );
};

export default Tasks;
