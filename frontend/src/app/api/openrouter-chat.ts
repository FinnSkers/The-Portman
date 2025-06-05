import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = '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';
const OPENROUTER_MODEL = 'qwen/qwen3-30b-a3b:free';

// Log error to a file with timestamp and details
function logError(error: any, context: any = {}) {
  try {
    const logPath = path.resolve(process.cwd(), 'openrouter-error.log');
    const timestamp = new Date().toISOString();
    const logEntry = `---\n[${timestamp}]\nError: ${typeof error === 'string' ? error : JSON.stringify(error)}\nContext: ${JSON.stringify(context)}\n---\n`;
    fs.appendFileSync(logPath, logEntry, { encoding: 'utf8' });
  } catch (e) {
    // If logging fails, ignore to avoid breaking API
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const backendRes = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages,
        max_tokens: 256
      })
    });
    const data = await backendRes.json();
    if (!backendRes.ok) {
      logError(data, { status: backendRes.status, messages });
      return NextResponse.json({
        message: data.error?.message || data.message || 'OpenRouter error',
        status: backendRes.status,
        openrouter: data
      }, { status: backendRes.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    logError(e, { location: 'catch', method: 'POST' });
    return NextResponse.json({ message: 'Error contacting OpenRouter.', error: String(e) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export default { POST };
