import React, { useState, useEffect } from 'react';
import {
  getStoredMeetings,
  saveMeetingRecord,
  updateMeetingRecord,
  deleteMeetingRecord,
} from './utils/storage';
import type { MeetingRecord, MinutesOfMeeting } from './types/meeting';
import { HeaderClock } from './components/HeaderClock';
import { DashboardStats } from './components/DashboardStats';
import { PreviousMeetingsPanel } from './components/PreviousMeetingsPanel';
import { AudioUploader } from './components/AudioUploader';
import { MomViewer } from './components/MomViewer';
import {
  FileText,
  Upload,
  CalendarClock,
  Sparkles,
  ShieldCheck,
  Download,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [activeMeeting, setActiveMeeting] = useState<MeetingRecord | null>(null);
  const [activeViewTab, setActiveViewTab] = useState<'upload' | 'view'>('upload');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize stored meetings on mount
  useEffect(() => {
    const loaded = getStoredMeetings();
    setMeetings(loaded);
    if (loaded.length > 0) {
      setActiveMeeting(loaded[0]);
      setActiveViewTab('view');
    } else {
      setActiveMeeting(null);
      setActiveViewTab('upload');
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // When MOM is generated from audio
  const handleMomGenerated = (
    mom: MinutesOfMeeting,
    audioInfo: { name: string; size: number; duration: string; url?: string }
  ) => {
    const newRecord: MeetingRecord = {
      id: `meet-${Date.now()}`,
      title: mom.title || 'Executive Meeting',
      addedAt: new Date().toISOString(), // The exact timestamp when this meeting was added
      meetingDate: mom.meetingDate || new Date().toLocaleDateString(),
      audioFileName: audioInfo.name,
      audioFileSize: audioInfo.size,
      duration: audioInfo.duration,
      category: mom.meetingType || 'Executive',
      mom,
      audioUrl: audioInfo.url,
    };

    const updated = saveMeetingRecord(newRecord);
    setMeetings(updated);
    setActiveMeeting(newRecord);
    setActiveViewTab('view');
    showToast(`MOM generated for "${newRecord.title}"! Added to previous meetings.`);
  };

  // Update MOM in place
  const handleUpdateMom = (updatedMom: MinutesOfMeeting) => {
    if (!activeMeeting) return;
    const updated = updateMeetingRecord(activeMeeting.id, updatedMom);
    setMeetings(updated);
    setActiveMeeting({
      ...activeMeeting,
      title: updatedMom.title,
      mom: updatedMom,
    });
    showToast('Changes saved to meeting record.');
  };

  // Delete meeting
  const handleDeleteMeeting = (id: string) => {
    const updated = deleteMeetingRecord(id);
    setMeetings(updated);
    if (activeMeeting?.id === id) {
      setActiveMeeting(updated.length > 0 ? updated[0] : null);
      if (updated.length === 0) {
        setActiveViewTab('upload');
      }
    }
    showToast('Meeting removed from history.');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col space-y-6">
        {/* 1. Header with Live Clock & Date */}
        <HeaderClock />

        {/* 2. Executive KPI Summary Cards */}
        <DashboardStats meetings={meetings} activeMeeting={activeMeeting} />

        {/* 3. Main Dashboard Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Dedicated Previous Meetings Archive Area (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <PreviousMeetingsPanel
              meetings={meetings}
              activeMeetingId={activeMeeting?.id || null}
              onSelectMeeting={(m) => {
                setActiveMeeting(m);
                setActiveViewTab('view');
              }}
              onDeleteMeeting={handleDeleteMeeting}
            />

            {/* Quick Helper / Info Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-sm border border-indigo-800/40">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-400/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Executive Word (.DOCX) Standards
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    All downloaded MOM files are genuine Microsoft Word documents (.docx) styled with corporate headers, attendee tables, and action items matrices ready for leadership sign-off.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Active MOM Generator & Viewer Workspace (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Action Bar Toggle: New Upload vs Active MOM */}
            <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveViewTab('upload')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeViewTab === 'upload'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload MP3 & Generate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveViewTab('view')}
                  disabled={!activeMeeting}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeViewTab === 'view'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View & Edit Active MOM</span>
                </button>
              </div>

              {activeMeeting && (
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] hidden sm:inline">
                  Viewing: <strong>{activeMeeting.title}</strong>
                </span>
              )}
            </div>

            {/* TAB CONTENT: Upload MP3 */}
            {activeViewTab === 'upload' && (
              <div className="space-y-4">
                <AudioUploader onMomGenerated={handleMomGenerated} />
              </div>
            )}

            {/* TAB CONTENT: View Active MOM */}
            {activeViewTab === 'view' && activeMeeting && (
              <MomViewer
                mom={activeMeeting.mom}
                onUpdateMom={handleUpdateMom}
                fileName={activeMeeting.audioFileName}
                addedAt={activeMeeting.addedAt}
              />
            )}

            {/* If View tab is selected but no active meeting */}
            {activeViewTab === 'view' && !activeMeeting && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  <CalendarClock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No meeting selected</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Select a previous meeting from the archive list on the left, or upload a new MP3 file to generate Minutes of Meeting.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveViewTab('upload')}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  Upload MP3 Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            MinuteCraft AI • Automated Meeting Minutes (MOM) & Microsoft Word (.docx) Synthesizer
          </span>
          <span className="text-[11px] text-slate-400">
            Powered by Gemini Multi-modal Audio Intelligence
          </span>
        </div>
      </footer>
    </div>
  );
}
