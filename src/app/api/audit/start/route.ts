import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auditSession';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, branch = 'audit' } = body as { url?: string; branch?: string };

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'url is required' } },
        { status: 400 }
      );
    }

    // URL shape validation: must have http(s) protocol, reasonable length
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'url must be a valid URL' } },
        { status: 400 }
      );
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'url must use http or https protocol' } },
        { status: 400 }
      );
    }

    if (url.length > 2048) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'url must be ≤ 2048 characters' } },
        { status: 400 }
      );
    }

    const sessionBranch = branch === 'faq' ? 'faq' : 'audit';
    const session_id = createSession(sessionBranch);

    return NextResponse.json({ session_id }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}
