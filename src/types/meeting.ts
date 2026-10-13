export interface Attendee {
  name: string;
  role?: string;
  status: 'present' | 'absent' | 'organizer';
  affiliation?: string;
}

export interface KeyDiscussionPoint {
  topic: string;
  summary: string;
  bulletPoints: string[];
  speakersInvolved?: string[];
}

export interface DecisionItem {
  decision: string;
  rationale?: string;
  approvedBy?: string;
}

export type ActionPriority = 'High' | 'Medium' | 'Low';
export type ActionStatus = 'Pending' | 'In Progress' | 'Completed';

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  deadline: string;
  priority: ActionPriority;
  status: ActionStatus;
}

export interface QuoteHighlight {
  speaker?: string;
  quote: string;
  timestamp?: string;
}

export interface UpcomingMeetingInfo {
  proposedDate?: string;
  tentativeAgenda?: string;
}

export interface MinutesOfMeeting {
  title: string;
  meetingDate: string;
  meetingType: string;
  durationEstimate: string;
  locationOrPlatform?: string;
  facilitator?: string;
  attendees: Attendee[];
  executiveSummary: string;
  keyDiscussionPoints: KeyDiscussionPoint[];
  decisions: DecisionItem[];
  actionItems: ActionItem[];
  nextSteps: string[];
  upcomingMeeting?: UpcomingMeetingInfo;
  keyQuotesOrHighlights?: QuoteHighlight[];
  transcriptSummary?: string;
  adjournmentNotes?: string;
}

export interface MeetingRecord {
  id: string;
  title: string;
  addedAt: string; // ISO date string of when this was added/created
  meetingDate: string;
  audioFileName: string;
  audioFileSize?: number;
  duration?: string;
  category: string;
  mom: MinutesOfMeeting;
  audioUrl?: string; // object URL or data URL if available
  tags?: string[];
}
