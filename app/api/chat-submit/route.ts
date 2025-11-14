import { NextRequest, NextResponse } from 'next/server';

export interface ChatSubmissionPayload {
  name: string;
  fee: number;
  platform: 'twitch' | 'discord' | 'youtube';
  userId: string;
  timestamp?: number;
}

export interface ChatSubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    entryId: string;
    name: string;
    timestamp: number;
  };
  error?: string;
}

// POST /api/chat-submit
// Accepts contestant submissions from external platforms
export async function POST(request: NextRequest) {
  try {
    const payload: ChatSubmissionPayload = await request.json();

    // Validate required fields
    if (!payload.name || typeof payload.name !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or missing name field',
          message: 'Name is required and must be a string',
        } as ChatSubmissionResponse,
        { status: 400 }
      );
    }

    if (typeof payload.fee !== 'number' || payload.fee < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid fee amount',
          message: 'Fee must be a positive number',
        } as ChatSubmissionResponse,
        { status: 400 }
      );
    }

    if (!['twitch', 'discord', 'youtube'].includes(payload.platform)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid platform',
          message: 'Platform must be one of: twitch, discord, youtube',
        } as ChatSubmissionResponse,
        { status: 400 }
      );
    }

    if (!payload.userId || typeof payload.userId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or missing userId',
          message: 'userId is required and must be a string',
        } as ChatSubmissionResponse,
        { status: 400 }
      );
    }

    // Sanitize name input
    const sanitizedName = payload.name.trim().substring(0, 30);

    if (sanitizedName.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Empty name',
          message: 'Name cannot be empty after trimming',
        } as ChatSubmissionResponse,
        { status: 400 }
      );
    }

    // Create entry ID
    const entryId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = Date.now();

    // Return success response with entry data
    // Note: Client-side must listen for this endpoint or use webhooks
    // to add the entry to their wheel
    return NextResponse.json(
      {
        success: true,
        message: 'Submission accepted',
        data: {
          entryId,
          name: sanitizedName,
          timestamp,
        },
      } as ChatSubmissionResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Chat submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to process submission',
      } as ChatSubmissionResponse,
      { status: 500 }
    );
  }
}

// GET /api/chat-submit
// Returns API documentation
export async function GET() {
  return NextResponse.json({
    name: 'GameWheel Chat Integration API',
    version: '1.0.0',
    endpoints: {
      'POST /api/chat-submit': {
        description: 'Submit a contestant from external chat platforms',
        payload: {
          name: 'string (required, max 30 chars)',
          fee: 'number (required, >= 0)',
          platform: '"twitch" | "discord" | "youtube" (required)',
          userId: 'string (required)',
        },
        responses: {
          200: 'Submission accepted',
          400: 'Invalid request',
          500: 'Server error',
        },
        example: {
          name: 'PlayerOne',
          fee: 5.0,
          platform: 'twitch',
          userId: 'user123',
        },
      },
    },
    usage: {
      curl: `curl -X POST https://your-domain.com/api/chat-submit \\
  -H "Content-Type: application/json" \\
  -d '{"name":"PlayerOne","fee":5.0,"platform":"twitch","userId":"user123"}'`,
    },
  });
}
