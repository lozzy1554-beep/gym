import React, { useState } from 'react';
import { Locale, Inquiry, InquiryStatus, MembershipPlan } from '../types';
import { uiTranslations } from '../data/translations';
import {
  Users,
  Search,
  Download,
  Filter,
  CheckCircle,
  Clock,
  Check,
  X,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface AdminPanelProps {
  locale: Locale;
  inquiries: Inquiry[];
  onUpdateInquiryStatus: (id: string, status: InquiryStatus, note?: string) => void;
  plans: MembershipPlan[];
  onTogglePlanPublish: (planId: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  locale,
  inquiries,
  onUpdateInquiryStatus,
  plans,
  onTogglePlanPublish,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'plans'>('inquiries');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const t = uiTranslations[locale];

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchStatus = statusFilter === 'all' || inq.status === statusFilter;
    const matchSearch =
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      (inq.email && inq.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const totalLeads = inquiries.length;
  const newLeads = inquiries.filter((i) => i.status === 'new').length;
  const convertedLeads = inquiries.filter((i) => i.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(inquiries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `titan_gym_inquiries_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveNote = (id: string) => {
    const inq = inquiries.find((i) => i.id === id);
    if (inq) {
      onUpdateInquiryStatus(id, inq.status, noteText);
    }
    setEditingNoteId(null);
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6 overflow-hidden">
      <div className="max-w-7xl w-full mx-auto bg-[#181B21] border border-[#2C313B] rounded-2xl flex flex-col h-full overflow-hidden shadow-2xl">
        {/* Admin Top Bar */}
        <div className="px-6 py-4 bg-[#0F1115] border-b border-[#2C313B] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-xl font-bold text-white uppercase tracking-wider">
                {t.admin.title}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#B6F500] text-[#0F1115] px-2 py-0.5 rounded">
                STAFF SECURE PORTAL
              </span>
            </div>
            <p className="text-xs text-[#A3A9B5] mt-0.5">{t.admin.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center p-1 bg-[#181B21] rounded-xl border border-[#2C313B]">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'inquiries'
                    ? 'bg-[#B6F500] text-[#0F1115]'
                    : 'text-[#A3A9B5] hover:text-white'
                }`}
              >
                {t.admin.tabInquiries} ({inquiries.length})
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'plans'
                    ? 'bg-[#B6F500] text-[#0F1115]'
                    : 'text-[#A3A9B5] hover:text-white'
                }`}
              >
                {t.admin.tabPlans}
              </button>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="px-4 py-1.5 rounded-lg bg-[#222630] border border-[#2C313B] text-xs font-semibold text-white hover:border-[#B6F500] transition-colors"
            >
              {t.admin.closeAdmin}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'inquiries' ? (
            <>
              {/* Metric KPI cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#0F1115] border border-[#2C313B]">
                  <div className="text-xs text-[#A3A9B5] uppercase font-semibold flex items-center justify-between">
                    <span>{t.admin.totalLeads}</span>
                    <Users className="w-4 h-4 text-[#B6F500]" />
                  </div>
                  <div className="font-display text-2xl font-bold text-white tabular-nums mt-1">
                    {totalLeads}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0F1115] border border-[#2C313B]">
                  <div className="text-xs text-[#A3A9B5] uppercase font-semibold flex items-center justify-between">
                    <span>{t.admin.statusNew}</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-display text-2xl font-bold text-amber-400 tabular-nums mt-1">
                    {newLeads}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0F1115] border border-[#2C313B]">
                  <div className="text-xs text-[#A3A9B5] uppercase font-semibold flex items-center justify-between">
                    <span>{t.admin.statusConverted}</span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-display text-2xl font-bold text-emerald-400 tabular-nums mt-1">
                    {convertedLeads}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0F1115] border border-[#2C313B]">
                  <div className="text-xs text-[#A3A9B5] uppercase font-semibold flex items-center justify-between">
                    <span>{t.admin.conversionRate}</span>
                    <TrendingUp className="w-4 h-4 text-[#B6F500]" />
                  </div>
                  <div className="font-display text-2xl font-bold text-white tabular-nums mt-1">
                    {conversionRate}%
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0F1115] p-3 rounded-xl border border-[#2C313B]">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-[#A3A9B5] absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.admin.searchInquiries}
                    className="w-full ps-9 pe-3 py-1.5 rounded-lg bg-[#181B21] border border-[#2C313B] text-xs text-white placeholder-[#A3A9B5]/60 focus:outline-none focus:border-[#B6F500]"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#A3A9B5]" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#181B21] border border-[#2C313B] text-xs text-white focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">{t.admin.statusNew}</option>
                      <option value="contacted">{t.admin.statusContacted}</option>
                      <option value="converted">{t.admin.statusConverted}</option>
                      <option value="closed">{t.admin.statusClosed}</option>
                    </select>
                  </div>

                  <button
                    onClick={handleExportJson}
                    className="px-3 py-1.5 rounded-lg bg-[#222630] text-xs font-medium text-white hover:text-[#B6F500] border border-[#2C313B] flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.admin.exportJson}</span>
                  </button>
                </div>
              </div>

              {/* Inquiries Table */}
              <div className="border border-[#2C313B] rounded-xl overflow-hidden bg-[#0F1115]">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-[#181B21] text-[#A3A9B5] uppercase font-semibold border-b border-[#2C313B]">
                      <tr>
                        <th className="px-4 py-3 text-start">Lead / Code</th>
                        <th className="px-4 py-3 text-start">Contact</th>
                        <th className="px-4 py-3 text-start">Type &amp; Window</th>
                        <th className="px-4 py-3 text-start">Goal / Message</th>
                        <th className="px-4 py-3 text-start">Status</th>
                        <th className="px-4 py-3 text-start">Staff Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2C313B]">
                      {filteredInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-[#A3A9B5]">
                            No inquiries match the current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredInquiries.map((inq) => (
                          <tr key={inq.id} className="hover:bg-[#181B21]/50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-bold text-white">{inq.fullName}</div>
                              <div className="font-mono text-[10px] text-[#B6F500]">{inq.id}</div>
                              <div className="text-[10px] text-[#A3A9B5]">{inq.createdAt}</div>
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap">
                              <bdi className="font-mono text-white block">{inq.phone}</bdi>
                              {inq.email && (
                                <span className="text-[11px] text-[#A3A9B5] block">{inq.email}</span>
                              )}
                              <a
                                href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-emerald-400 hover:underline"
                              >
                                Open in WhatsApp →
                              </a>
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  inq.type === 'trial'
                                    ? 'bg-[#B6F500]/15 text-[#B6F500]'
                                    : 'bg-blue-500/15 text-blue-400'
                                }`}
                              >
                                {inq.type === 'trial' ? '1-Day Free Trial' : 'General Inquiry'}
                              </span>
                              {inq.preferredTime && (
                                <div className="text-[10px] text-[#A3A9B5] mt-1 capitalize">
                                  Window: {inq.preferredTime}
                                </div>
                              )}
                            </td>

                            <td className="px-4 py-3 max-w-xs">
                              {inq.goal && (
                                <div className="text-[11px] font-semibold text-white mb-0.5">
                                  {inq.goal}
                                </div>
                              )}
                              <p className="text-[11px] text-[#A3A9B5] line-clamp-2">
                                {inq.message || '—'}
                              </p>
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap">
                              <select
                                value={inq.status}
                                onChange={(e) =>
                                  onUpdateInquiryStatus(inq.id, e.target.value as InquiryStatus)
                                }
                                className={`px-2 py-1 rounded text-xs font-semibold border ${
                                  inq.status === 'new'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : inq.status === 'contacted'
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                    : inq.status === 'converted'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                                }`}
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="converted">Converted</option>
                                <option value="closed">Closed</option>
                              </select>
                            </td>

                            <td className="px-4 py-3 min-w-[180px]">
                              {editingNoteId === inq.id ? (
                                <div className="space-y-1.5">
                                  <input
                                    type="text"
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Add staff note..."
                                    className="w-full px-2 py-1 rounded bg-[#181B21] border border-[#2C313B] text-white text-[11px] focus:outline-none"
                                  />
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => handleSaveNote(inq.id)}
                                      className="px-2 py-0.5 bg-[#B6F500] text-[#0F1115] text-[10px] font-bold rounded"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingNoteId(null)}
                                      className="px-2 py-0.5 bg-[#222630] text-white text-[10px] rounded"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    setEditingNoteId(inq.id);
                                    setNoteText(inq.internalNote || '');
                                  }}
                                  className="text-[11px] text-[#A3A9B5] cursor-pointer hover:text-white"
                                  title="Click to edit internal note"
                                >
                                  {inq.internalNote ? (
                                    <span>📝 {inq.internalNote}</span>
                                  ) : (
                                    <span className="italic text-[#A3A9B5]/60">+ Add note</span>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Plans Management Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0F1115] border border-[#2C313B] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Membership Plans Roster</h4>
                  <p className="text-xs text-[#A3A9B5]">
                    Toggle plans visibility on the public website. Prices are synchronized in PKR.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-xl bg-[#0F1115] border border-[#2C313B] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-white text-sm">{p.en.name}</h5>
                        <span className="font-urdu text-xs text-[#A3A9B5]">({p.ur.name})</span>
                      </div>
                      <div className="text-xs text-[#B6F500] font-mono mt-1">
                        PKR {p.pricePKR.toLocaleString()} / 30 Days
                      </div>
                      <div className="text-[11px] text-[#A3A9B5] mt-1">
                        {p.en.features.length} features listed
                      </div>
                    </div>

                    <button
                      onClick={() => onTogglePlanPublish(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                        p.isPublished
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                    >
                      {p.isPublished ? 'Published' : 'Hidden'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
