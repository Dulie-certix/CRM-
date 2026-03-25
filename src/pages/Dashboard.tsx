import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts';
import {
  Mail, Briefcase, Users, CheckSquare, ChevronRight,
  Search, SlidersHorizontal, ArrowUpDown, Phone,
  MapPin, User,
} from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { NoteStats } from '../types/note';

/* ── Static sample data (matches design) ── */
const AGENDA = [
  { time: '11:00 - 12:00 Feb 2, 2019', color: '#F59E0B', title: 'Meeting with Client', desc: 'This monthly progress agenda' },
  { time: '11:00 - 12:00 Feb 2, 2019', color: '#5B5BD6', title: 'Meeting with Client', desc: 'This monthly progress agenda' },
  { time: '11:00 - 12:00 Feb 2, 2019', color: '#EF4444', title: 'Meeting with Client', desc: 'This monthly progress agenda' },
  { time: '11:00 - 12:00 Feb 2, 2019', color: '#10B981', title: 'Meeting with Client', desc: 'This monthly progress agenda' },
];

const BAR_DATA = [
  { month: 'Jan', rate: 45 }, { month: 'Feb', rate: 38 }, { month: 'Mar', rate: 55 },
  { month: 'Apr', rate: 30 }, { month: 'May', rate: 48 }, { month: 'Jun', rate: 42 },
  { month: 'Jul', rate: 64 }, { month: 'Aug', rate: 50 }, { month: 'Sep', rate: 58 },
  { month: 'Oct', rate: 44 }, { month: 'Nov', rate: 52 }, { month: 'Dec', rate: 47 },
];

const PEOPLE = [
  { name: 'Robert Fox',   email: 'robertfox@example.com',  phone: '(671) 555-0110', category: 'Employee',  categoryColor: 'bg-blue-100 text-blue-700',   location: 'Austin',      gender: 'Male' },
  { name: 'Cody Fisher',  email: 'codyfisher@example.com', phone: '(505) 555-0125', category: 'Customers', categoryColor: 'bg-violet-100 text-violet-700', location: 'Orange',      gender: 'Male' },
  { name: 'Albert Flores',email: 'albertflores@example.com',phone: '(704) 555-0127', category: 'Customers', categoryColor: 'bg-violet-100 text-violet-700', location: 'Pembroke...',gender: 'Female' },
  { name: 'Floyd Miles',  email: 'floydmiles@example.com', phone: '(405) 555-0128', category: 'Employee',  categoryColor: 'bg-blue-100 text-blue-700',   location: 'Fairfield',   gender: 'Male' },
  { name: 'Arlene McCoy', email: 'arlenecoy@example.com',  phone: '(219) 555-0114', category: 'Partners',  categoryColor: 'bg-orange-100 text-orange-700',location: 'Toledo',      gender: 'Female' },
];

const COMPANIES = [
  { name: 'Product Hunt', industry: 'Web Design',      location: 'New York City, NY', status: 'Active', statusColor: 'text-emerald-600', dot: 'bg-emerald-500', logo: '🅿' },
  { name: 'Google',       industry: 'Search Engine',   location: 'New York City, NY', status: 'Active', statusColor: 'text-emerald-600', dot: 'bg-emerald-500', logo: '🅶' },
  { name: 'Wordpress',    industry: 'Web Development', location: 'New York City, NY', status: 'Active', statusColor: 'text-emerald-600', dot: 'bg-emerald-500', logo: '🅆' },
  { name: 'Tripadvisor',  industry: 'Travel Reviews',  location: 'New York City, NY', status: 'Lead',   statusColor: 'text-amber-600',   dot: 'bg-amber-500',   logo: '🅣' },
  { name: 'Slack',        industry: 'Communication',   location: 'New York City, NY', status: 'Lead',   statusColor: 'text-amber-600',   dot: 'bg-amber-500',   logo: '🅢' },
];

const DONUT_DATA = [
  { name: 'Agency',          value: 80,  color: '#111827' },
  { name: 'Marketing',       value: 60,  color: '#374151' },
  { name: 'Communication',   value: 50,  color: '#6B7280' },
  { name: 'Web Development', value: 90,  color: '#D1D5DB' },
  { name: 'Travel',          value: 61,  color: '#F3F4F6' },
];

/* ── Stat Card ── */
const StatCard: React.FC<{
  icon: React.ReactNode; label: string; value: string;
}> = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between">
      <div className="w-9 h-9 rounded-lg bg-[#F4F5F7] flex items-center justify-center text-text-secondary">
        {icon}
      </div>
      <ChevronRight size={16} className="text-text-muted" />
    </div>
    <div>
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

/* ── Custom bar tooltip ── */
const BarTooltip: React.FC<{ active?: boolean; payload?: { value: number }[]; label?: string }> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111827] text-white text-xs rounded-lg px-3 py-2 shadow-dropdown">
      <p className="font-semibold mb-0.5">{label} 2023</p>
      <p>Open Rate <span className="font-bold">{payload[0].value}%</span></p>
    </div>
  );
};

/* ── Dashboard ── */
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<NoteStats>({ total: 0, completed: 0, pending: 0 });
  const [activeBar, setActiveBar] = useState<number | null>(6); // July highlighted

  useEffect(() => {
    api.get<NoteStats>('/notes/stats').then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-text-primary mb-5">Dashboard</h1>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Mail size={18} />}        label="Email Sent"     value="1,251 Mail" />
        <StatCard icon={<Briefcase size={18} />}   label="Active Company" value="43 Company" />
        <StatCard icon={<Users size={18} />}       label="Total Contact"  value={`${stats.total > 0 ? stats.total : 162} Contact`} />
        <StatCard icon={<CheckSquare size={18} />} label="Ongoing Task"   value={`${stats.pending > 0 ? stats.pending : 5} Task`} />
      </div>

      {/* ── Agenda + Chart row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">

        {/* Upcoming Agenda */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
          <h2 className="text-base font-semibold text-text-primary mb-4">Upcoming Agenda</h2>
          <div className="space-y-4">
            {AGENDA.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-1 rounded-full shrink-0 mt-1" style={{ backgroundColor: item.color, minHeight: '48px' }} />
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: item.color }}>{item.time}</p>
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Open Rate Chart */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-border p-5">
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-base font-semibold text-text-primary">Average Email Open Rate</h2>
            <div className="flex gap-2">
              <select className="text-xs border border-border rounded-lg px-2 py-1 text-text-secondary bg-white">
                <option>January, 2023 - December, 2023</option>
              </select>
              <select className="text-xs border border-border rounded-lg px-2 py-1 text-text-secondary bg-white">
                <option>Month</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl font-bold text-text-primary">64,23%</span>
            <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              ↑ 12%
            </span>
          </div>
          <p className="text-xs text-text-muted mb-3">Average Open Rate</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={BAR_DATA} barSize={22} onMouseLeave={() => setActiveBar(null)}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<BarTooltip />} cursor={false} />
              <Bar dataKey="rate" radius={[4, 4, 0, 0]}
                onMouseEnter={(_, index) => setActiveBar(index)}>
                {BAR_DATA.map((_, index) => (
                  <Cell key={index} fill={index === activeBar ? '#111827' : '#E5E7EB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── People table ── */}
      <div className="bg-white rounded-xl border border-border mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-text-primary">People</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F5F7] rounded-lg border border-border">
              <Search size={13} className="text-text-muted" />
              <input placeholder="Search" className="bg-transparent text-xs outline-none w-28 text-text-primary placeholder:text-text-muted" />
              <div className="flex gap-1">
                <kbd className="text-[10px] text-text-muted bg-white border border-border rounded px-1">⌘</kbd>
                <kbd className="text-[10px] text-text-muted bg-white border border-border rounded px-1">F</kbd>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-text-secondary hover:bg-background transition">
              <ArrowUpDown size={13} /> Sort By
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-text-secondary hover:bg-background transition">
              <SlidersHorizontal size={13} /> Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-th w-8"><input type="checkbox" className="rounded" /></th>
                <th className="table-th">Name <span className="inline-block ml-1">↕</span></th>
                <th className="table-th">Email <span className="inline-block ml-1">↕</span></th>
                <th className="table-th">Phone <span className="inline-block ml-1">↕</span></th>
                <th className="table-th">Category <span className="inline-block ml-1">↕</span></th>
                <th className="table-th">Location <span className="inline-block ml-1">↕</span></th>
                <th className="table-th">Gender <span className="inline-block ml-1">↕</span></th>
                <th className="table-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {PEOPLE.map((p, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-[#FAFAFA] transition">
                  <td className="table-td"><input type="checkbox" className="rounded" /></td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Mail size={12} /> {p.email}
                    </div>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Phone size={12} /> {p.phone}
                    </div>
                  </td>
                  <td className="table-td">
                    <span className={`badge ${p.categoryColor}`}>{p.category}</span>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <MapPin size={12} /> {p.location}
                    </div>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <User size={13} /> {p.gender}
                    </div>
                  </td>
                  <td className="table-td">
                    <div className="flex gap-1.5">
                      <button className="px-2.5 py-1 text-xs border border-border rounded-lg hover:bg-background transition flex items-center gap-1">
                        <Phone size={11} /> Call
                      </button>
                      <button className="px-2.5 py-1 text-xs border border-border rounded-lg hover:bg-background transition flex items-center gap-1">
                        <Mail size={11} /> M
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Companies + Donut row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Companies table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-text-primary">Companies</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F4F5F7] rounded-lg border border-border">
                <Search size={13} className="text-text-muted" />
                <input placeholder="Search" className="bg-transparent text-xs outline-none w-24 placeholder:text-text-muted" />
                <div className="flex gap-1">
                  <kbd className="text-[10px] text-text-muted bg-white border border-border rounded px-1">⌘</kbd>
                  <kbd className="text-[10px] text-text-muted bg-white border border-border rounded px-1">F</kbd>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-text-secondary hover:bg-background transition">
                <SlidersHorizontal size={13} /> Sort By
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-text-secondary hover:bg-background transition">
                <SlidersHorizontal size={13} /> Filter
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-th">Companies Name <span className="ml-1">↕</span></th>
                  <th className="table-th">Industry <span className="ml-1">↕</span></th>
                  <th className="table-th">Location <span className="ml-1">↕</span></th>
                  <th className="table-th">Status <span className="ml-1">↕</span></th>
                </tr>
              </thead>
              <tbody>
                {COMPANIES.map((c, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-[#FAFAFA] transition">
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F4F5F7] flex items-center justify-center text-xs font-bold">
                          {c.logo}
                        </div>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="table-td text-text-secondary">{c.industry}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <MapPin size={12} /> {c.location}
                      </div>
                    </td>
                    <td className="table-td">
                      <div className={`flex items-center gap-1.5 text-sm font-medium ${c.statusColor}`}>
                        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                        {c.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company Categories donut */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="text-base font-semibold text-text-primary mb-4">Company Categories</h2>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <PieChart width={180} height={180}>
                <Pie
                  data={DONUT_DATA}
                  cx={85} cy={85}
                  innerRadius={55} outerRadius={85}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {DONUT_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xl font-bold text-text-primary">341</p>
                <p className="text-xs text-text-muted">Companies</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {DONUT_DATA.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-text-secondary">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
