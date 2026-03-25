import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Pencil, Trash2, CheckCircle, Clock,
  MoreHorizontal, SlidersHorizontal, Image as ImageIcon,
  LayoutGrid, List, User,
} from 'lucide-react';
import api from '../api/axios';
import { Note, NoteStatus } from '../types/note';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Card from '../components/Card';

/* ── Status badge ── */
const StatusBadge: React.FC<{ status: NoteStatus }> = ({ status }) =>
  status === 'completed' ? (
    <span className="badge-completed">
      <CheckCircle size={11} /> Completed
    </span>
  ) : (
    <span className="badge-pending">
      <Clock size={11} /> Pending
    </span>
  );

/* ── Row action menu ── */
const RowMenu: React.FC<{ noteId: string; onDelete: (id: string) => void }> = ({ noteId, onDelete }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Note actions"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-background text-text-muted hover:text-text-primary transition"
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-36 bg-white rounded-xl border border-border shadow-dropdown py-1">
            <Link
              to={`/notes/edit/${noteId}`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-background transition"
              onClick={() => setOpen(false)}
            >
              <Pencil size={13} /> Edit note
            </Link>
            <button
              onClick={() => { setOpen(false); onDelete(noteId); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger hover:bg-red-50 transition"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/* ── Note Card (Grid view) ── */
const NoteCard: React.FC<{ note: Note; onDelete: (id: string) => void }> = ({ note, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const tagColors = [
    'bg-amber-100 text-amber-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-blue-100 text-blue-700',
    'bg-pink-100 text-pink-700',
  ];
  const tags = note.title.split(' ').slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-border shadow-card flex flex-col overflow-hidden hover:shadow-md transition">
      {/* Tags */}
      <div className="flex items-center gap-1.5 px-4 pt-4 pb-2">
        {tags.map((tag, i) => (
          <span key={i} className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColors[i % tagColors.length]}`}>
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <div className="px-4 pb-2">
        <h3 className="text-sm font-semibold text-text-primary leading-snug">{note.title}</h3>
      </div>

      {/* Description / image */}
      {note.image ? (
        <img src={note.image} alt="" className="mx-4 mb-3 rounded-lg object-cover h-28 border border-border" />
      ) : (
        <p className="px-4 pb-3 text-xs text-text-secondary line-clamp-3">{note.description}</p>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between px-4 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={11} className="text-primary" />
          </div>
          <span className="text-xs text-text-secondary truncate max-w-[100px]">
            {note.assignedTo || 'Unassigned'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">
            {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center justify-center w-6 h-6 rounded-lg hover:bg-background text-text-muted hover:text-text-primary transition"
            >
              <MoreHorizontal size={13} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 bottom-7 z-20 w-36 bg-white rounded-xl border border-border shadow-dropdown py-1">
                  <Link
                    to={`/notes/edit/${note._id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-background transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Pencil size={13} /> Edit note
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(note._id); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger hover:bg-red-50 transition"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main component ── */
const Notes: React.FC = () => {
  const [notes, setNotes]       = useState<Note[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState<'all' | NoteStatus>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  useEffect(() => {
    api.get<Note[]>('/notes')
      .then((r) => setNotes(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = notes;
    if (filter !== 'all') list = list.filter((n) => n.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [notes, filter, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/notes/${deleteId}`);
      setNotes((prev) => prev.filter((n) => n._id !== deleteId));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const counts = useMemo(() => ({
    all:       notes.length,
    pending:   notes.filter((n) => n.status === 'pending').length,
    completed: notes.filter((n) => n.status === 'completed').length,
  }), [notes]);

  const tabs: { key: 'all' | NoteStatus; label: string }[] = [
    { key: 'all',       label: `All (${counts.all})` },
    { key: 'pending',   label: `Pending (${counts.pending})` },
    { key: 'completed', label: `Completed (${counts.completed})` },
  ];

  return (
    <Layout
      title="Notes"
      subtitle="Manage and track all your CRM notes"
      actions={
        <Link to="/notes/add">
          <Button icon={<Plus size={15} />}>New Note</Button>
        </Link>
      }
    >
      <Card padding="none">
        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filter === t.key
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* View toggle + Search + filter */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center justify-center w-8 h-8 transition ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:bg-background'
                }`}
                title="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center justify-center w-8 h-8 transition ${
                  viewMode === 'table' ? 'bg-primary text-white' : 'text-text-muted hover:bg-background'
                }`}
                title="Table view"
              >
                <List size={14} />
              </button>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="h-9 pl-8 pr-3 text-sm bg-background border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                           placeholder:text-text-muted w-52 transition"
              />
            </div>
            <button className="flex items-center gap-1.5 h-9 px-3 text-sm text-text-secondary border border-border rounded-lg hover:bg-background transition">
              <SlidersHorizontal size={14} /> Filter
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-background">
              <SlidersHorizontal size={24} className="text-text-muted" />
            </div>
            <p className="text-sm font-medium text-text-primary">No notes found</p>
            <p className="text-xs text-text-muted">
              {search ? 'Try a different search term' : 'Create your first note to get started'}
            </p>
            {!search && (
              <Link to="/notes/add">
                <Button size="sm" icon={<Plus size={14} />}>New Note</Button>
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((note) => (
                <NoteCard key={note._id} note={note} onDelete={setDeleteId} />
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-border">
              <p className="text-xs text-text-muted">
                Showing <span className="font-medium text-text-primary">{filtered.length}</span> of{' '}
                <span className="font-medium text-text-primary">{notes.length}</span> notes
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="table-th w-8">
                    <input
                      type="checkbox"
                      aria-label="Select all notes"
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                  </th>
                  <th className="table-th">Title</th>
                  <th className="table-th hidden md:table-cell">Description</th>
                  <th className="table-th">Status</th>
                  <th className="table-th hidden lg:table-cell">Due Date</th>
                  <th className="table-th hidden lg:table-cell">Created</th>
                  <th className="table-th w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((note) => (
                  <tr key={note._id} className="hover:bg-background/60 transition group">
                    {/* Checkbox */}
                    <td className="table-td w-8">
                      <input
                        type="checkbox"
                        aria-label={`Select note: ${note.title}`}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                    </td>

                    {/* Title + image indicator */}
                    <td className="table-td">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {note.image ? (
                          <img
                            src={note.image}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover shrink-0 border border-border"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
                            <ImageIcon size={13} className="text-primary" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate max-w-[180px]">
                            {note.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="table-td hidden md:table-cell">
                      <p className="text-sm text-text-secondary truncate max-w-[240px]">
                        {note.description}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="table-td">
                      <StatusBadge status={note.status} />
                    </td>

                    {/* Due date */}
                    <td className="table-td hidden lg:table-cell text-text-secondary">
                      {note.dueDate
                        ? new Date(note.dueDate).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })
                        : <span className="text-text-muted">—</span>}
                    </td>

                    {/* Created */}
                    <td className="table-td hidden lg:table-cell text-text-secondary">
                      {new Date(note.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="table-td">
                      <RowMenu noteId={note._id} onDelete={setDeleteId} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border">
              <p className="text-xs text-text-muted">
                Showing <span className="font-medium text-text-primary">{filtered.length}</span> of{' '}
                <span className="font-medium text-text-primary">{notes.length}</span> notes
              </p>
              <div className="flex items-center gap-1">
                <button className="h-7 px-2.5 text-xs rounded-lg border border-border text-text-secondary hover:bg-background transition disabled:opacity-40" disabled>
                  Previous
                </button>
                <button className="h-7 w-7 text-xs rounded-lg bg-primary text-white font-medium">1</button>
                <button className="h-7 px-2.5 text-xs rounded-lg border border-border text-text-secondary hover:bg-background transition disabled:opacity-40" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ── Delete confirm modal ── */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Note" size="sm">
        <p className="text-sm text-text-secondary mb-5">
          Are you sure you want to delete this note? This action is permanent and cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
            Delete note
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default Notes;
