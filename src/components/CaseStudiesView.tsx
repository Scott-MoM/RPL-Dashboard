import React, { useState } from 'react';
import { CaseStudy, Region, UserRole } from '../types';
import { BookOpen, PlusCircle, Search, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

interface CaseStudiesViewProps {
  caseStudies: CaseStudy[];
  onAddCaseStudy: (newStudy: Omit<CaseStudy, 'id'>) => void;
  selectedRegion: Region;
  userRole: UserRole;
}

export const CaseStudiesView: React.FC<CaseStudiesViewProps> = ({
  caseStudies,
  onAddCaseStudy,
  selectedRegion,
  userRole
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [region, setRegion] = useState<Region>(selectedRegion === 'Global' ? 'North of England' : selectedRegion);
  const [successMessage, setSuccessMessage] = useState('');

  const filteredStudies = caseStudies.filter(cs => {
    const matchesRegion = selectedRegion === 'Global' || cs.region === selectedRegion;
    const matchesSearch = cs.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cs.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddCaseStudy({
      title,
      content,
      region,
      date_added: new Date().toISOString().replace('T', ' ').substring(0, 19),
      author: 'Current User'
    });

    setTitle('');
    setContent('');
    setShowAddForm(false);
    setSuccessMessage('Case study submitted successfully!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const REGION_OPTIONS: Region[] = ["North of England", "South of England", "Midlands", "Wales", "Other"];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Qualitative Case Studies
          </h2>
          <p className="text-xs text-slate-400">
            Real stories and participant journeys capturing qualitative outdoor mental health impact.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search case studies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 w-48 sm:w-64"
            />
          </div>

          {userRole !== 'Funder' && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showAddForm ? 'Cancel' : 'Add Case Study'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Case Study Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-4 border-l-4 border-l-amber-400">
          <h3 className="text-sm font-bold text-slate-100">Submit New Participant Narrative</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. South Downs Outdoor Healing Journey"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-white/20 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className="w-full bg-slate-950 border border-white/20 rounded-xl p-2.5 text-xs text-slate-100"
              >
                {REGION_OPTIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Narrative Text & Impact Story</label>
            <textarea
              required
              rows={4}
              placeholder="Describe the participant background, experience on the course, and qualitative outcomes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-white/20 rounded-xl p-2.5 text-xs text-slate-100 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg"
            >
              Submit Case Study
            </button>
          </div>
        </form>
      )}

      {/* Case Studies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStudies.length === 0 ? (
          <div className="col-span-full p-8 text-center glass-card rounded-2xl text-xs text-slate-400">
            No case studies found matching your current filters.
          </div>
        ) : (
          filteredStudies.map((cs) => (
            <div key={cs.id} className="glass-card p-6 rounded-2xl space-y-3 glass-card-hover border-t-2 border-t-amber-400">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-base font-bold text-slate-100 leading-snug">
                  {cs.title}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 font-semibold">
                  {cs.region}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                "{cs.content}"
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {cs.date_added}
                </span>
                {cs.author && (
                  <span>Added by: <strong className="text-slate-200">{cs.author}</strong></span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
