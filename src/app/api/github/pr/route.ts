import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createPR } from '@/lib/Github';
import { getLogger } from '@/lib/Logger';

const logger = getLogger().child({ namespace: 'API:/api/github/pr' });
logger.level = 'error';

export async function POST(req: NextRequest): Promise<NextResponse | void> {
  try {
    const postBody: Record<string, any> = await req.json();

    const { owner, repo, title, body, head, base } = postBody;

    if (!owner || !repo || !title || !body || !head || !base) {
      return NextResponse.json(
        {
          error:
            'Missing required parameters: owner, repo, title, body, head or base',
        },
        { status: 400 }
      );
    }

    const response = await createPR(owner, repo, title, body, head, base);
    if (response) {
      return NextResponse.json(
        response,
        { status: 201, statusText: 'OK' } // 201 status code for resource creation
      );
    }
    return NextResponse.json(
      { error: 'no response from Github API' },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Error in API: ${err}` },
      { status: 500 }
    );
  }
}
