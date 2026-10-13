import React, { useState } from 'react';
import {
  FileDown,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  FileText,
  Building2,
  Save,
  Quote,
  Sparkles,
  MessagesSquare,
} from 'lucide-react';
import type { MinutesOfMeeting } from '../types/meeting';
import { generateDocxBlob, downloadDocxFile } from '../utils/docxGenerator';

interface MomViewerProps {
  mom: MinutesOfMeeting;
  onUpdateMom: (updated: MinutesOfMeeting) => void;
  fileName?: string;
  addedAt?: string;
}

export const MomViewer: React.FC<MomViewerProps> = ({
  mom,
  onUpdateMom,
  fileName = 'meeting-recording.mp3',
  addedAt,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  // Only Summary, Discussion Points, and Key Quotes tabs
  const [activeTab, setActiveTab] = useState<'summary' | 'discussions' | 'quotes'>('summary');

  // Editable local state
  const [title, setTitle] = useState(mom.title);
  const [meetingDate, setMeetingDate] = useState(mom.meetingDate);
  const [executiveSummary, setExecutiveSummary] = useState(mom.executiveSummary);
  const [facilitator, setFacilitator] = useState(mom.facilitator || '');

  // Update local state when prop changes
  React.useEffect(() => {
    setTitle(mom.title);
    setMeetingDate(mom.meetingDate);
    setExecutiveSummary(mom.executiveSummary);
    setFacilitator(mom.facilitator || '');
  }, [mom]);

  // Handle DOCX Export
  const handleExportDocx = async () => {
    try {
      setIsExporting(true);
      const updatedMom: MinutesOfMeeting = {
        ...mom,
        title,
        meetingDate,
        executiveSummary,
        facilitator,
      };
      const blob = await generateDocxBlob(updatedMom);
      const safeTitle = (title || 'Meeting_MOM').replace(/[^a-zA-Z0-9_-]/g, '_');
      downloadDocxFile(blob, `MOM_${safeTitle}.docx`);
    } catch (err) {
      console.error('Failed to export DOCX:', err);
      alert('Could not export DOCX document. Please check console.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Save edits to storage
  const handleSaveChanges = () => {
    const updatedMom: MinutesOfMeeting = {
      ...mom,
      title,
      meetingDate,
      executiveSummary,
      facilitator,
    };
    onUpdateMom(updatedMom);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Copy Markdown to Clipboard
  const handleCopyMarkdown = () => {
    const md = `# MINUTES OF MEETING: ${title}
**Date:** ${meetingDate}
**Facilitator:** ${facilitator || 'N/A'}
**Duration:** ${mom.durationEstimate || 'N/A'}
**Meeting Type:** ${mom.meetingType}

## Executive Summary
${executiveSummary}

## Key Discussion Points
${(mom.keyDiscussionPoints || [])
  .map(
    (p, i) => `### ${i + 1}. ${p.topic}
${p.summary}
${p.bulletPoints.map((b) => `- ${b}`).join('\n')}`
  )
  .join('\n\n')}

## Key Quotes & Statements
${(mom.keyQuotesOrHighlights || []).map((q) => `> "${q.quote}" — ${q.speaker || 'Speaker'}${q.timestamp ? ` (${q.timestamp})` : ''}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const keyQuotes = mom.keyQuotesOrHighlights || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Top Action Bar & Download Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 text-white border-b border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider text-[10px]">
                {mom.meetingType || 'Minutes of Meeting'}
              </span>
              <span className="text-slate-400">File: {fileName}</span>
              {addedAt && (
                <span className="text-slate-400">• Added: {new Date(addedAt).toLocaleDateString()}</span>
              )}
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl sm:text-2xl font-black bg-transparent border-b border-dashed border-slate-500/50 hover:border-indigo-400 focus:border-indigo-400 focus:outline-none w-full text-white placeholder-slate-400 py-0.5 transition-colors"
              title="Click to edit meeting title"
            />
          </div>

          {/* Action buttons: DOCX primary button */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportDocx}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all cursor-pointer ring-2 ring-blue-400/30"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExporting ? 'Generating DOCX...' : 'Download Word (.docx)'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Copy formatted markdown text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveChanges}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Save in-place modifications to meeting archive"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4 text-slate-400" />}
              <span>{savedSuccess ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Meeting Date</div>
              <input
                type="text"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="bg-transparent text-slate-200 font-medium hover:text-white focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Duration</div>
              <div className="text-slate-200 font-medium">{mom.durationEstimate || '30 mins'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Facilitator / Chair</div>
              <input
                type="text"
                value={facilitator}
                onChange={(e) => setFacilitator(e.target.value)}
                placeholder="Meeting Chair"
                className="bg-transparent text-slate-200 font-medium hover:text-white focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Platform / Venue</div>
              <div className="text-slate-200 font-medium truncate">{mom.locationOrPlatform || 'Virtual Audio Conference'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Only Executive Summary, Discussion Points, Key Quotes & Statements) */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'summary'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Executive Summary</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('discussions')}
          className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'discussions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessagesSquare className="w-4 h-4" />
          <span>Discussion Points ({mom.keyDiscussionPoints?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quotes')}
          className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'quotes'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Quote className="w-4 h-4" />
          <span>Key Quotes & Statements ({keyQuotes.length})</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 overflow-y-auto max-h-[640px]">
        {/* TAB 1: EXECUTIVE SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Discussion Topics</div>
                <div className="text-2xl font-black text-indigo-950 mt-1">{mom.keyDiscussionPoints?.length || 0}</div>
                <div className="text-[11px] text-indigo-600 mt-0.5">Synthesized</div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100">
                <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Key Quotes</div>
                <div className="text-2xl font-black text-purple-950 mt-1">{keyQuotes.length}</div>
                <div className="text-[11px] text-purple-600 mt-0.5">Key statements</div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Duration</div>
                <div className="text-2xl font-black text-blue-950 mt-1">{mom.durationEstimate || '30m'}</div>
                <div className="text-[11px] text-blue-600 mt-0.5">Audio recording</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Attendees</div>
                <div className="text-2xl font-black text-emerald-950 mt-1">{mom.attendees?.length || 0}</div>
                <div className="text-[11px] text-emerald-600 mt-0.5">Stakeholders listed</div>
              </div>
            </div>

            {/* Executive Summary Box */}
            <div className="bg-slate-50 rounded-xl p-5 border-l-4 border-l-indigo-600 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Executive Summary
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Editable</span>
              </div>
              <textarea
                rows={4}
                value={executiveSummary}
                onChange={(e) => setExecutiveSummary(e.target.value)}
                className="w-full text-sm text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Attendees & Participation */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Attendees & Participation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {mom.attendees?.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{att.name}</div>
                      <div className="text-[11px] text-slate-500">{att.role || 'Participant'}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        att.status === 'organizer'
                          ? 'bg-purple-100 text-purple-700'
                          : att.status === 'absent'
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {att.status || 'Present'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Quotes and Statements highlight */}
            {keyQuotes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Quote className="w-4 h-4 text-purple-600" />
                    Key Quotes & Statements
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('quotes')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    View All ({keyQuotes.length}) →
                  </button>
                </div>
                <div className="space-y-2.5">
                  {keyQuotes.slice(0, 3).map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100 text-xs italic text-slate-800 relative"
                    >
                      <span className="text-purple-400 font-serif text-lg leading-none mr-1">“</span>
                      {q.quote}
                      <span className="text-purple-400 font-serif text-lg leading-none ml-1">”</span>
                      <div className="mt-1 text-[11px] not-italic font-bold text-purple-900 flex items-center justify-between">
                        <span>— {q.speaker || 'Speaker'}</span>
                        {q.timestamp && <span className="text-slate-400 font-mono text-[10px]">{q.timestamp}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps & Upcoming Meeting */}
            {(mom.nextSteps?.length > 0 || mom.upcomingMeeting) && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Next Steps & Next Scheduled Session
                </h3>
                {mom.nextSteps?.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 mb-3">
                    {mom.nextSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                )}
                {mom.upcomingMeeting && (
                  <div className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                    <strong className="text-slate-900">Next Meeting:</strong>{' '}
                    {mom.upcomingMeeting.proposedDate || 'TBD'}
                    {mom.upcomingMeeting.tentativeAgenda && (
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Agenda: {mom.upcomingMeeting.tentativeAgenda}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KEY DISCUSSION POINTS */}
        {activeTab === 'discussions' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Detailed Agenda Topics & Minutes
            </h3>

            {mom.keyDiscussionPoints?.map((topic, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    {topic.topic}
                  </h4>
                  {topic.speakersInvolved && topic.speakersInvolved.length > 0 && (
                    <div className="text-[11px] text-slate-500 font-medium">
                      Speakers: {topic.speakersInvolved.join(', ')}
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-700 mb-3 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  {topic.summary}
                </p>

                {topic.bulletPoints && topic.bulletPoints.length > 0 && (
                  <div className="space-y-1.5 pl-3 border-l-2 border-indigo-200">
                    {topic.bulletPoints.map((bp, bpIdx) => (
                      <div key={bpIdx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{bp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: KEY QUOTES & STATEMENTS */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Quote className="w-4 h-4 text-purple-600" />
                  Key Quotes and Statements
                </h3>
                <p className="text-xs text-slate-500">
                  Notable quotes, executive affirmations, and key statements recorded during the meeting
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                {keyQuotes.length} Quotes
              </span>
            </div>

            {keyQuotes.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <Quote className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-600">No specific quotes extracted for this meeting.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Check the Executive Summary and Discussion Points tabs for key conclusions.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {keyQuotes.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-purple-50/30 border border-purple-100 hover:border-purple-200 transition-all flex flex-col justify-between shadow-2xs"
                  >
                    <div className="text-xs text-slate-800 leading-relaxed italic">
                      <span className="text-purple-400 font-serif text-lg leading-none mr-1">“</span>
                      {q.quote}
                      <span className="text-purple-400 font-serif text-lg leading-none ml-1">”</span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-purple-100/60 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-purple-950">
                        {q.speaker || 'Meeting Participant'}
                      </span>
                      {q.timestamp && (
                        <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-purple-100">
                          {q.timestamp}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer bar with quick Word DOCX download trigger */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Includes Microsoft Word tables, sign-off blocks, and corporate styling</span>
        </div>

        <button
          type="button"
          onClick={handleExportDocx}
          disabled={isExporting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>Export {title || 'MOM'}.docx</span>
        </button>
      </div>
    </div>
  );
};
