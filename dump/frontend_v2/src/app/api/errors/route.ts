import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/authOptions';

interface ErrorReport {
  errorId: string;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  userEmail?: string;
}

// In production, you would store these in a database or send to a monitoring service
const errorStore: ErrorReport[] = [];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    const userId = (session?.user && 'id' in session.user) ? (session.user as { id?: string }).id : undefined;
    const userEmail = session?.user?.email ?? undefined;

    const errorReport: ErrorReport = {
      errorId: body.errorId,
      message: body.message,
      stack: body.stack,
      componentStack: body.componentStack,
      timestamp: body.timestamp || new Date().toISOString(),
      userAgent: body.userAgent || request.headers.get('user-agent') || 'unknown',
      url: body.url,
      userId,
      userEmail,
    };

    // Validate required fields
    if (!errorReport.errorId || !errorReport.message) {
      return NextResponse.json(
        { error: 'Missing required fields: errorId and message' },
        { status: 400 }
      );
    }

    // Store error report (in production, save to database or send to monitoring service)
    errorStore.push(errorReport);

    // Log error for server-side monitoring
    console.error('Client Error Report:', {
      errorId: errorReport.errorId,
      message: errorReport.message,
      userId: errorReport.userId,
      url: errorReport.url,
      timestamp: errorReport.timestamp
    });

    return NextResponse.json(
      { 
        success: true, 
        errorId: errorReport.errorId,
        message: 'Error report received successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Failed to process error report:', error);
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving error reports (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin (you might have a different admin check)
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    // Get recent errors
    const recentErrors = errorStore
      .slice(-limit - offset)
      .slice(-limit)
      .reverse();

    return NextResponse.json({
      errors: recentErrors,
      total: errorStore.length,
      limit,
      offset
    });

  } catch (error) {
    console.error('Failed to retrieve error reports:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve error reports' },
      { status: 500 }
    );
  }
}

// Helper function to check admin status
function isAdmin(email: string): boolean {
  // In production, check against your user database
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  return adminEmails.includes(email);
}
