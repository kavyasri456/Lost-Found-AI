export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  source?: 'n8n' | 'fallback';
}

export const DEFAULT_N8N_WEBHOOK_URL =
  'https://kavyasri456.app.n8n.cloud/webhook/29afff09-fe2b-4ab2-b542-510561a0994e/chat';

export interface SendMessageOptions {
  webhookUrl?: string;
  sessionId?: string;
}

export interface SendMessageResponse {
  reply: string;
  isN8nSuccess: boolean;
  statusHint?: string;
}

// Generates smart contextual fallback responses if the n8n workflow is paused or returning 404
function generateLocalCampusFallback(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes('airpod') || lower.includes('earbud') || lower.includes('headphone')) {
    return "I found an active report: Apple AirPods Pro (2nd Gen) in sky blue silicone cover turned in at the Main Library Circulation Desk. Bring device pairing proof to claim it!";
  }
  if (lower.includes('hydro') || lower.includes('bottle') || lower.includes('flask')) {
    return "There is a green Hydro Flask with hiking stickers currently held at the Campus Rec & Gym Front Desk. Handover hours are 8:00 AM – 9:00 PM.";
  }
  if (lower.includes('calculator') || lower.includes('ti-84')) {
    return "A Texas Instruments graphing calculator with a slide cover was reported found in Engineering Hall Room 302 and is kept at the Engineering Dept Admin Desk.";
  }
  if (lower.includes('id') || lower.includes('card')) {
    return "If you lost or found a Campus Student ID, please report to North Dining Commons manager or the University Card Services office. Do not post full ID numbers publicly.";
  }
  if (lower.includes('report') || lower.includes('how to')) {
    return "To file a report, click 'Report Item' in the navigation bar. Provide item details, location, and photos so our matching engine can cross-reference opposite reports.";
  }
  if (lower.includes('pickup') || lower.includes('safe') || lower.includes('where')) {
    return "Official campus handover hubs are: (1) Main Library 1st Floor Desk, (2) Student Union Welcome Counter, and (3) Campus Rec Reception Desk.";
  }

  return `I've received your query: "${query}". You can browse all active campus items under the 'Browse Items' tab or file a detailed inquiry under 'Report Item'.`;
}

export async function sendChatMessageToN8n(
  message: string,
  options: SendMessageOptions = {}
): Promise<SendMessageResponse> {
  const url = options.webhookUrl || DEFAULT_N8N_WEBHOOK_URL;
  const sessionId = options.sessionId || 'campus-session-' + Date.now();

  try {
    const payload = {
      chatInput: message,
      message: message,
      sessionId: sessionId,
      action: 'sendMessage',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      let hint = '';

      if (response.status === 404) {
        hint =
          'n8n workflow is currently inactive. Activate your workflow in n8n (toggle in top-right of canvas) to enable live model outputs.';
      } else {
        hint = `n8n server returned status ${response.status}.`;
      }

      console.warn('n8n webhook error:', response.status, errorText);
      return {
        reply: generateLocalCampusFallback(message),
        isN8nSuccess: false,
        statusHint: hint,
      };
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      // Handle common n8n AI Agent response structures:
      // data.output, data.text, data.response, data.message, or string
      const reply =
        data.output ||
        data.text ||
        data.response ||
        data.message ||
        (Array.isArray(data) && data[0]?.output) ||
        (Array.isArray(data) && data[0]?.text) ||
        JSON.stringify(data);

      return {
        reply: typeof reply === 'string' ? reply : JSON.stringify(reply),
        isN8nSuccess: true,
      };
    } else {
      const text = await response.text();
      return {
        reply: text || generateLocalCampusFallback(message),
        isN8nSuccess: true,
      };
    }
  } catch (err: any) {
    console.warn('Network error reaching n8n webhook directly:', err);
    return {
      reply: generateLocalCampusFallback(message),
      isN8nSuccess: false,
      statusHint:
        'Could not reach n8n cloud webhook directly (Check internet connection or enable CORS / workflow activation in n8n).',
    };
  }
}
