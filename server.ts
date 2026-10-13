import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import type { Request, Response } from 'express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware for parsing large audio files as JSON Base64
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health & Status endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Generate Minutes of Meeting (MOM) endpoint
app.post('/api/generate-mom', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/mp3', fileName = 'meeting-recording.mp3', contextNotes = '' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({
        error: 'Missing audio data. Please provide audioBase64.',
      });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in server environment. Please ensure GEMINI_API_KEY is provided.',
        code: 'MISSING_API_KEY',
      });
    }

    // Clean audio base64 if it has data URL prefix (e.g. data:audio/mp3;base64,...)
    const cleanBase64 = audioBase64.replace(/^data:audio\/[a-zA-Z0-9.+_-]+;base64,/, '');

    const systemInstruction = `You are an elite Executive Chief of Staff and certified Minutes of Meeting (MOM) recorder.
Your task is to analyze the provided meeting audio recording and produce a comprehensive, structured, professional Minutes of Meeting (MOM).

Key requirements:
1. Deduce or synthesize a clear, formal Meeting Title.
2. Estimate the meeting duration and deduce the meeting type (e.g., Executive Strategy, Sprint Planning, Client Review, Engineering Architecture, Team Standup).
3. Identify meeting participants/attendees with names, inferred roles, and whether they actively spoke or led the meeting.
4. Provide a high-level Executive Summary (2-4 clear, concise sentences highlighting the primary objective and outcomes).
5. Extract all Key Discussion Points organized by topic, with a synopsis, bulleted discussion details, and speakers involved.
6. Record all Official Decisions Made, including context and who approved or reached consensus.
7. Build an actionable Action Items Matrix with specific tasks, assigned individuals, clear realistic deadlines (or 'TBD' / 'Next Sprint' / specific dates), priority levels (High, Medium, Low), and initial status (Pending or In Progress).
8. Detail Next Steps and tentative Upcoming Meeting details if mentioned.
9. Provide Key Highlights or Memorable Quotes with approximate timestamps or speaker labels.
10. Provide an edited transcript synopsis capturing the flow of the conversation.

Return ONLY a valid JSON object matching the requested schema.`;

    const promptText = `Please analyze this meeting recording file "${fileName}".
${contextNotes ? `User context/agenda notes: "${contextNotes}"` : ''}

Extract complete, highly detailed, and professional Minutes of Meeting (MOM). Ensure all action items, decisions, attendees, and discussion topics are captured thoroughly.`;

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/mp3',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    const momResponseSchema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'A formal and descriptive title for the meeting.',
        },
        meetingDate: {
          type: Type.STRING,
          description: 'Date and time of the meeting in formal readable format (e.g. October 13, 2026 at 10:00 AM).',
        },
        meetingType: {
          type: Type.STRING,
          description: 'Category/Type of meeting (e.g. Executive Strategy, Product Sync, Technical Architecture, All Hands).',
        },
        durationEstimate: {
          type: Type.STRING,
          description: 'Estimated duration of the meeting (e.g. 35 mins).',
        },
        locationOrPlatform: {
          type: Type.STRING,
          description: 'Virtual / in-person meeting platform (e.g. Google Meet, Zoom, Boardroom A).',
        },
        facilitator: {
          type: Type.STRING,
          description: 'Primary speaker or meeting leader/chair.',
        },
        attendees: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              status: { type: Type.STRING, description: 'present, absent, or organizer' },
            },
            required: ['name'],
          },
        },
        executiveSummary: {
          type: Type.STRING,
          description: 'Crisp executive summary of 2 to 4 sentences outlining the meeting purpose and core outcomes.',
        },
        keyDiscussionPoints: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              summary: { type: Type.STRING },
              bulletPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              speakersInvolved: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['topic', 'summary', 'bulletPoints'],
          },
        },
        decisions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              decision: { type: Type.STRING },
              rationale: { type: Type.STRING },
              approvedBy: { type: Type.STRING },
            },
            required: ['decision'],
          },
        },
        actionItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING },
              assignee: { type: Type.STRING },
              deadline: { type: Type.STRING },
              priority: { type: Type.STRING, description: 'High, Medium, or Low' },
              status: { type: Type.STRING, description: 'Pending, In Progress, or Completed' },
            },
            required: ['task', 'assignee', 'deadline', 'priority', 'status'],
          },
        },
        nextSteps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        upcomingMeeting: {
          type: Type.OBJECT,
          properties: {
            proposedDate: { type: Type.STRING },
            tentativeAgenda: { type: Type.STRING },
          },
        },
        keyQuotesOrHighlights: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              speaker: { type: Type.STRING },
              quote: { type: Type.STRING },
              timestamp: { type: Type.STRING },
            },
            required: ['quote'],
          },
        },
        transcriptSummary: {
          type: Type.STRING,
          description: 'A structured overview or chronological transcript synopsis of the meeting recording.',
        },
      },
      required: [
        'title',
        'meetingDate',
        'meetingType',
        'durationEstimate',
        'executiveSummary',
        'keyDiscussionPoints',
        'decisions',
        'actionItems',
      ],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [audioPart, textPart],
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: momResponseSchema,
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error('Gemini model returned empty response.');
    }

    const momData = JSON.parse(outputText);
    return res.json({
      success: true,
      mom: momData,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating MOM with Gemini:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process audio and generate MOM',
      details: error.toString(),
    });
  }
});

// Vite Middleware for development, or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MinuteCraft server is active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
