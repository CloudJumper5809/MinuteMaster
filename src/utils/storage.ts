import type { MeetingRecord } from '../types/meeting';

const STORAGE_KEY = 'minutecraft_meetings_v1';

export const INITIAL_SAMPLE_MEETINGS: MeetingRecord[] = [
  {
    id: 'meet-sample-1',
    title: 'Q4 Product Roadmap & Enterprise AI Strategy',
    addedAt: '2026-10-12T15:30:00.000Z',
    meetingDate: 'October 12, 2026, 02:00 PM - 02:45 PM',
    audioFileName: 'q4-product-ai-strategy.mp3',
    audioFileSize: 18450000,
    duration: '45 mins',
    category: 'Product Strategy',
    tags: ['Roadmap', 'AI', 'Q4'],
    mom: {
      title: 'Q4 Product Roadmap & Enterprise AI Strategy',
      meetingDate: 'October 12, 2026, 02:00 PM - 02:45 PM',
      meetingType: 'Product Strategy & Architecture',
      durationEstimate: '45 mins',
      locationOrPlatform: 'Google Meet (Audio Recorded)',
      facilitator: 'Elena Rostova (Head of Product)',
      attendees: [
        { name: 'Elena Rostova', role: 'Head of Product', status: 'organizer' },
        { name: 'David Chen', role: 'VP Engineering', status: 'present' },
        { name: 'Sophia Miller', role: 'Staff ML Engineer', status: 'present' },
        { name: 'Marcus Vance', role: 'Head of Design', status: 'present' },
        { name: 'Rachel Zane', role: 'Enterprise Account Exec', status: 'absent' },
      ],
      executiveSummary:
        'The executive committee finalized the Q4 technical roadmap with an accelerated pivot towards enterprise multi-modal AI agents and real-time audio transcription. Engineering confirmed architecture milestones for late November, while Product committed to customer validation sprints starting next week.',
      keyDiscussionPoints: [
        {
          topic: 'Enterprise AI Agent Capabilities & Model Selection',
          summary:
            'Sophia presented benchmarking results between modern audio transcription models and standard speech engines. The team agreed that native audio streaming reduces latency by 40%.',
          bulletPoints: [
            'Low latency audio processing is required for real-time customer meeting summaries.',
            'Target latency window: under 1200ms per 30-minute meeting analysis.',
            'Security validation for SOC-2 Type II audit has been scheduled for Nov 10.',
          ],
          speakersInvolved: ['Sophia Miller', 'David Chen'],
        },
        {
          topic: 'Document Export & Workflow Integrations',
          summary:
            'Customer advisory councils indicated high demand for standardized Microsoft Word (.docx) Minutes of Meeting exports that comply with corporate legal guidelines.',
          bulletPoints: [
            'Word template must include structured Action Item matrices with assignees and SLAs.',
            'Direct email dispatch to all meeting attendees will be prioritized for v1.2.',
            'User customizable executive cover headers requested by 6 enterprise accounts.',
          ],
          speakersInvolved: ['Elena Rostova', 'Marcus Vance'],
        },
        {
          topic: 'Resource Allocation & Sprint Sequencing',
          summary:
            'David reviewed team bandwidth across Core Infrastructure and Frontend Design pods.',
          bulletPoints: [
            'Allocated 3 senior backend engineers to the audio ingestion pipeline.',
            'Design freeze set for Friday Oct 24th.',
          ],
          speakersInvolved: ['David Chen'],
        },
      ],
      decisions: [
        {
          decision: 'Standardize on Microsoft Word (.docx) as the official export format for enterprise Minutes of Meeting.',
          rationale: '85% of corporate clients require DOCX for audit trails and signature sign-offs.',
          approvedBy: 'Elena Rostova & David Chen',
        },
        {
          decision: 'Adopt automated speaker diarization and action item extraction as standard features.',
          rationale: 'Dramatically reduces manual note-taking overhead from 45 minutes down to seconds.',
          approvedBy: 'Unanimous consensus',
        },
      ],
      actionItems: [
        {
          id: 'act-1',
          task: 'Benchmark MP3 compression pipeline to maintain transcription accuracy under 25MB file limits',
          assignee: 'Sophia Miller',
          deadline: '2026-10-18',
          priority: 'High',
          status: 'In Progress',
        },
        {
          id: 'act-2',
          task: 'Deliver updated executive DOCX corporate typography and table styling assets',
          assignee: 'Marcus Vance',
          deadline: '2026-10-21',
          priority: 'Medium',
          status: 'Pending',
        },
        {
          id: 'act-3',
          task: 'Prepare SOC-2 compliance checklist for cloud audio processing retention rules',
          assignee: 'David Chen',
          deadline: '2026-10-25',
          priority: 'High',
          status: 'Pending',
        },
        {
          id: 'act-4',
          task: 'Distribute revised Q4 milestone roadmap deck to executive leadership team',
          assignee: 'Elena Rostova',
          deadline: '2026-10-16',
          priority: 'Medium',
          status: 'Completed',
        },
      ],
      nextSteps: [
        'Complete user testing of the DOCX generation pipeline with pilot customers.',
        'Hold engineering review for audio buffer handling next Tuesday at 10:00 AM.',
      ],
      upcomingMeeting: {
        proposedDate: 'October 20, 2026 at 10:00 AM',
        tentativeAgenda: 'Architecture Review & Sprint 44 Demo',
      },
      keyQuotesOrHighlights: [
        {
          speaker: 'David Chen',
          quote: '"By generating formatted Word documents directly, we eliminate one of the biggest administrative time-sinks for managers."',
          timestamp: '18:40',
        },
        {
          speaker: 'Sophia Miller',
          quote: '"The transcription accuracy on multi-speaker debates has surpassed our initial 95% target threshold."',
          timestamp: '32:15',
        },
      ],
      transcriptSummary:
        'Elena opened the session at 02:00 PM outlining Q4 objectives. Sophia took over at 02:08 PM detailing model evaluation benchmarks. David discussed capacity constraints and hiring updates. Consensus reached on the Word DOCX export specification at 02:35 PM. Meeting adjourned at 02:45 PM.',
    },
  },
  {
    id: 'meet-sample-2',
    title: 'Weekly Engineering Architecture & Cloud Infrastructure Sync',
    addedAt: '2026-10-11T11:15:00.000Z',
    meetingDate: 'October 11, 2026, 10:00 AM - 10:35 AM',
    audioFileName: 'cloud-architecture-sync.mp3',
    audioFileSize: 14200000,
    duration: '35 mins',
    category: 'Engineering',
    tags: ['Cloud', 'DevOps', 'Architecture'],
    mom: {
      title: 'Weekly Engineering Architecture & Cloud Infrastructure Sync',
      meetingDate: 'October 11, 2026, 10:00 AM - 10:35 AM',
      meetingType: 'Engineering Architecture Sync',
      durationEstimate: '35 mins',
      locationOrPlatform: 'Discord Tech Huddle (Recorded)',
      facilitator: 'Arjun Mehta (Lead DevOps Architect)',
      attendees: [
        { name: 'Arjun Mehta', role: 'Lead DevOps Architect', status: 'organizer' },
        { name: 'Sarah Kowalski', role: 'Principal Backend Engineer', status: 'present' },
        { name: 'Kenji Sato', role: 'Database Administrator', status: 'present' },
        { name: 'Liam O’Connor', role: 'Site Reliability Engineer', status: 'present' },
      ],
      executiveSummary:
        'The engineering architecture group reviewed microservice horizontal scaling metrics, database connection pooling under high peak loads, and the migration to zero-downtime deployment pipelines.',
      keyDiscussionPoints: [
        {
          topic: 'High Throughput Audio Upload Pipeline',
          summary: 'Evaluated multipart streaming upload vs direct memory buffer ingestion.',
          bulletPoints: [
            '50MB max upload buffer accommodates 99% of voice memos and 1-hour MP3 meetings.',
            'Added automatic client-side audio compression hints for files over 45MB.',
          ],
          speakersInvolved: ['Arjun Mehta', 'Sarah Kowalski'],
        },
        {
          topic: 'Database Schema & Cache Invalidation',
          summary: 'Kenji reviewed query performance on meeting history and search filters.',
          bulletPoints: [
            'Added index on addedAt timestamp to optimize chronological queries.',
            'Target sub-10ms response time for dashboard retrieval.',
          ],
          speakersInvolved: ['Kenji Sato'],
        },
      ],
      decisions: [
        {
          decision: 'Increase audio upload request limit to 60MB across all reverse proxies.',
          rationale: 'Accommodates higher quality stereo MP3 recordings from executive conference rooms.',
          approvedBy: 'Arjun Mehta',
        },
      ],
      actionItems: [
        {
          id: 'act-21',
          task: 'Deploy updated reverse proxy payload limits to production cluster',
          assignee: 'Liam O’Connor',
          deadline: '2026-10-14',
          priority: 'High',
          status: 'In Progress',
        },
        {
          id: 'act-22',
          task: 'Run load test with 50 concurrent MP3 audio uploads to verify memory stability',
          assignee: 'Sarah Kowalski',
          deadline: '2026-10-15',
          priority: 'Medium',
          status: 'Pending',
        },
      ],
      nextSteps: [
        'Review load test telemetry logs on Thursday morning.',
      ],
      upcomingMeeting: {
        proposedDate: 'October 18, 2026 at 10:00 AM',
        tentativeAgenda: 'Infrastructure Cost Optimization & Failover Drill',
      },
      keyQuotesOrHighlights: [
        {
          speaker: 'Arjun Mehta',
          quote: '"Reliability during large file uploads is fundamental to user trust."',
          timestamp: '14:20',
        },
      ],
      transcriptSummary:
        'Arjun started with current cluster uptime report. Sarah walked through streaming payload benchmarks. Kenji confirmed query optimizations are in staging. Liam scheduled the maintenance window.',
    },
  },
  {
    id: 'meet-sample-3',
    title: 'Customer Advisory Board: Minutes of Meeting Automation Feedback',
    addedAt: '2026-10-09T17:45:00.000Z',
    meetingDate: 'October 09, 2026, 04:00 PM - 04:40 PM',
    audioFileName: 'customer-advisory-board.mp3',
    audioFileSize: 16800000,
    duration: '40 mins',
    category: 'Client Advisory',
    tags: ['Feedback', 'Customers', 'DOCX'],
    mom: {
      title: 'Customer Advisory Board: Minutes of Meeting Automation Feedback',
      meetingDate: 'October 09, 2026, 04:00 PM - 04:40 PM',
      meetingType: 'Customer Advisory & Feedback',
      durationEstimate: '40 mins',
      locationOrPlatform: 'Zoom Meeting Room',
      facilitator: 'Jessica Morales (Director of Customer Success)',
      attendees: [
        { name: 'Jessica Morales', role: 'Director of Customer Success', status: 'organizer' },
        { name: 'Arthur Pendelton', role: 'Chief Legal Officer, Apex Global', status: 'present' },
        { name: 'Claire Dubois', role: 'Chief of Staff, Verve Media', status: 'present' },
        { name: 'Tom Higgins', role: 'Project Director, Horizon Bio', status: 'present' },
      ],
      executiveSummary:
        'Enterprise clients praised the structured Minutes of Meeting output, highlighting that the Word DOCX export has reduced post-meeting admin work by over 80%. Key requested enhancements included live dashboard time tracking and instant meeting history access.',
      keyDiscussionPoints: [
        {
          topic: 'Format Compliance & Corporate Legal Requirements',
          summary: 'Arthur discussed regulatory compliance for board meeting minutes.',
          bulletPoints: [
            'Legal departments require formal sign-off sections with Prepared By and Approved By lines.',
            'Action item matrices must specify explicit assignees and due dates for corporate audits.',
          ],
          speakersInvolved: ['Arthur Pendelton', 'Jessica Morales'],
        },
        {
          topic: 'Dashboard Usability & History Access',
          summary: 'Claire requested a prominent meeting history archive directly on the dashboard.',
          bulletPoints: [
            'Users want to see the exact date each meeting was added to the archive.',
            'Quick one-click re-download of DOCX files from the past meeting history list.',
          ],
          speakersInvolved: ['Claire Dubois'],
        },
      ],
      decisions: [
        {
          decision: 'Incorporate official signature lines and document metadata block into all DOCX templates.',
          rationale: 'Direct requirement from legal and executive board members.',
          approvedBy: 'Jessica Morales',
        },
      ],
      actionItems: [
        {
          id: 'act-31',
          task: 'Ensure dashboard shows previous meetings with explicit addition timestamps',
          assignee: 'Frontend Team',
          deadline: '2026-10-13',
          priority: 'High',
          status: 'Completed',
        },
        {
          id: 'act-32',
          task: 'Add one-click DOCX download directly from the previous meetings dashboard list',
          assignee: 'Product Team',
          deadline: '2026-10-13',
          priority: 'High',
          status: 'Completed',
        },
      ],
      nextSteps: [
        'Send upgraded build to advisory board members for sign-off.',
      ],
      upcomingMeeting: {
        proposedDate: 'November 06, 2026',
        tentativeAgenda: 'Advisory Board Q4 Review & Feature Voting',
      },
    },
  },
];

export function getStoredMeetings(): MeetingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Start clean with no unwanted older meetings
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Purge the older default sample records that the user did not put in
      const filtered = parsed.filter(
        (m) => m && m.id !== 'meet-sample-1' && m.id !== 'meet-sample-2' && m.id !== 'meet-sample-3'
      );
      if (filtered.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      }
      return filtered;
    }
    return [];
  } catch (err) {
    console.error('Failed to read meetings from localStorage:', err);
    return [];
  }
}

export function saveMeetingRecord(record: MeetingRecord): MeetingRecord[] {
  try {
    const existing = getStoredMeetings();
    // Prepend new record so newest is first
    const updated = [record, ...existing.filter((m) => m.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save meeting record:', err);
    return [];
  }
}

export function updateMeetingRecord(id: string, updatedMom: MeetingRecord['mom']): MeetingRecord[] {
  try {
    const existing = getStoredMeetings();
    const updated = existing.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          title: updatedMom.title || m.title,
          category: updatedMom.meetingType || m.category,
          mom: updatedMom,
        };
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to update meeting record:', err);
    return [];
  }
}

export function deleteMeetingRecord(id: string): MeetingRecord[] {
  try {
    const existing = getStoredMeetings();
    const updated = existing.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete meeting record:', err);
    return [];
  }
}

// Safely loads sample meetings WITHOUT deleting any user-created newer meetings
export function resetToSampleMeetings(): MeetingRecord[] {
  try {
    const existing = getStoredMeetings();
    // Keep all meetings that the user added
    const userMeetings = existing.filter((m) => !m.id.startsWith('meet-sample-'));
    // Merge: user meetings first (newest), then samples
    const updated = [...userMeetings, ...INITIAL_SAMPLE_MEETINGS];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to load sample meetings:', err);
    return [];
  }
}
