import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createBranch } from '@/lib/Github';
import { getLogger } from '@/lib/Logger';

const logger = getLogger().child({ namespace: 'API:/api/github/content' });
logger.level = 'error';

export async function POST(req: NextRequest): Promise<NextResponse | void> {
  try {
    const body: Record<string, any> = await req.json();

    const { owner, repo, branch, sourceBranch } = body;

    if (!owner || !repo || !branch || !sourceBranch) {
      return NextResponse.json(
        {
          error:
            'Missing required parameters: owner, repo, branch or sourceBranch',
        },
        { status: 400 }
      );
    }

    const response = await createBranch(owner, repo, branch, sourceBranch);
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
