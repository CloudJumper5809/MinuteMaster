import React from 'react';
import {
  FileCheck,
  MessagesSquare,
  Quote,
  FileSpreadsheet,
} from 'lucide-react';
import type { MeetingRecord } from '../types/meeting';

interface DashboardStatsProps {
  meetings: MeetingRecord[];
  activeMeeting: MeetingRecord | null;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ meetings }) => {
  const totalMeetings = meetings.length;

  let totalTopics = 0;
  let totalQuotes = 0;

  meetings.forEach((m) => {
    if (m.mom?.keyDiscussionPoints) {
      totalTopics += m.mom.keyDiscussionPoints.length;
    }
    if (m.mom?.keyQuotesOrHighlights) {
      totalQuotes += m.mom.keyQuotesOrHighlights.length;
    }
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Stat 1: Total Meetings */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <FileCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900">{totalMeetings}</div>
          <div className="text-xs text-slate-500 font-medium">Recorded Meetings</div>
        </div>
      </div>

      {/* Stat 2: Discussion Topics */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <MessagesSquare className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900">{totalTopics}</div>
          <div className="text-xs text-slate-500 font-medium">Discussion Topics</div>
        </div>
      </div>

      {/* Stat 3: Key Quotes */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Quote className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900">{totalQuotes}</div>
          <div className="text-xs text-slate-500 font-medium">Key Quotes Recorded</div>
        </div>
      </div>

      {/* Stat 4: DOCX Ready */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900">100%</div>
          <div className="text-xs text-slate-500 font-medium">Word .DOCX Export Ready</div>
        </div>
      </div>
    </div>
  );
};
