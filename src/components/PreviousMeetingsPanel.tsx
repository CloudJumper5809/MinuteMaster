import React, { useState } from 'react';
import {
  CalendarClock,
  FileDown,
  ExternalLink,
  Trash2,
  Search,
  Tag,
  Clock,
  AudioWaveform,
  CalendarPlus,
  MessagesSquare,
  Quote,
} from 'lucide-react';
import type { MeetingRecord } from '../types/meeting';
import { generateDocxBlob, downloadDocxFile } from '../utils/docxGenerator';

interface PreviousMeetingsPanelProps {
  meetings: MeetingRecord[];
  activeMeetingId: string | null;
  onSelectMeeting: (meeting: MeetingRecord) => void;
  onDeleteMeeting: (id: string) => void;
}

export const PreviousMeetingsPanel: React.FC<PreviousMeetingsPanelProps> = ({
  meetings,
  activeMeetingId,
  onSelectMeeting,
  onDeleteMeeting,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Extract unique categories
  const categories = Array.from(new Set(meetings.map((m) => m.category || 'General')));

  // Filter meetings
  const filtered = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.category && m.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.mom.facilitator && m.mom.facilitator.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Format the "Added On" date nicely
  const formatAddedDate = (isoString: string): { formattedDate: string; relative: string } => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return { formattedDate: isoString, relative: '' };

      const formatted = date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const timeStr = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Calculate relative time
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let relative = '';
      if (diffMins < 5) relative = 'Just now';
      else if (diffMins < 60) relative = `${diffMins}m ago`;
      else if (diffHours < 24) relative = `${diffHours}h ago`;
      else if (diffDays === 1) relative = 'Yesterday';
      else relative = `${diffDays}d ago`;

      return {
        formattedDate: `${formatted} at ${timeStr}`,
        relative,
      };
    } catch {
      return { formattedDate: isoString, relative: '' };
    }
  };

  const handleQuickDownloadDocx = async (e: React.MouseEvent, meeting: MeetingRecord) => {
    e.stopPropagation();
    try {
      setDownloadingId(meeting.id);
      const blob = await generateDocxBlob(meeting.mom);
      const safeTitle = (meeting.title || 'Meeting_MOM').replace(/[^a-zA-Z0-9_-]/g, '_');
      downloadDocxFile(blob, `MOM_${safeTitle}.docx`);
    } catch (err) {
      console.error('Failed to export DOCX:', err);
      alert('Could not generate DOCX. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Panel Header with Prominent Icon */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* The Prominent Dashboard Icon */}
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 ring-4 ring-indigo-50">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Previous Meetings
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                  {meetings.length}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Archive of processed meeting recordings & date added history
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search meetings by title, topic, or speaker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-2xs"
          />
        </div>

        {/* Categories Chips */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All ({meetings.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Meetings List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[580px] p-2 space-y-2">
        {filtered.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <CalendarClock className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No previous meetings found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {searchQuery
                ? 'Try adjusting your search filter or clear the query.'
                : 'Upload an MP3 audio recording to generate your first Minutes of Meeting!'}
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isSelected = activeMeetingId === item.id;
            const addedDateInfo = formatAddedDate(item.addedAt);
            const topicCount = item.mom.keyDiscussionPoints?.length || 0;
            const quoteCount = item.mom.keyQuotesOrHighlights?.length || 0;

            return (
              <div
                key={item.id}
                onClick={() => onSelectMeeting(item)}
                className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:bg-slate-50/80'
                }`}
              >
                {/* Top Row: Category & Added Date Timestamp */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-800 transition-colors">
                    <Tag className="w-3 h-3" />
                    {item.category || 'Meeting'}
                  </span>

                  {/* Explicit "Added On" Date & Time */}
                  <div
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100/70 px-2 py-0.5 rounded-md"
                    title={`Added to dashboard on: ${addedDateInfo.formattedDate}`}
                  >
                    <CalendarPlus className="w-3 h-3 text-indigo-500" />
                    <span>Added:</span>
                    <span className="font-semibold text-slate-700">{addedDateInfo.formattedDate}</span>
                    {addedDateInfo.relative && (
                      <span className="text-[10px] text-slate-400">({addedDateInfo.relative})</span>
                    )}
                  </div>
                </div>

                {/* Meeting Title */}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                {/* File info & Meeting Actual Time */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {item.duration || item.mom.durationEstimate || '30m'}
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-[150px] text-slate-600">
                    <AudioWaveform className="w-3.5 h-3.5 text-slate-400" />
                    {item.audioFileName}
                  </span>
                  <span className="flex items-center gap-1 text-blue-700 font-medium">
                    <MessagesSquare className="w-3.5 h-3.5 text-blue-500" />
                    {topicCount} Topics
                  </span>
                  {quoteCount > 0 && (
                    <span className="flex items-center gap-1 text-purple-700 font-medium">
                      <Quote className="w-3.5 h-3.5 text-purple-500" />
                      {quoteCount} Quotes
                    </span>
                  )}
                </div>

                {/* Action Buttons bar */}
                <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400 truncate">
                    Chair: {item.mom.facilitator || 'Elena Rostova'}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* One-Click DOCX Download */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickDownloadDocx(e, item)}
                      disabled={downloadingId === item.id}
                      title="Download as Word DOCX document"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/60 shadow-2xs cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-blue-600" />
                      <span>{downloadingId === item.id ? 'Exporting...' : '.DOCX'}</span>
                    </button>

                    {/* View MOM button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMeeting(item);
                      }}
                      title="Open full MOM document in dashboard"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>View</span>
                    </button>

                    {/* Delete meeting button with reliable inline confirm */}
                    {confirmDeleteId === item.id ? (
                      <div
                        className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-md p-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteMeeting(item.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-0.5 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors shadow-2xs cursor-pointer"
                          title="Confirm permanent deletion"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          className="px-1.5 py-0.5 text-[11px] text-slate-600 hover:text-slate-800 rounded transition-colors cursor-pointer"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(item.id);
                        }}
                        title="Delete meeting from archive"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
