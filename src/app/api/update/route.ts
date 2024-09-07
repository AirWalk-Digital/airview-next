// app/api/update/route.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { headers } = req;
    const body = await req.json();
    const debug: { added: string[]; modified: string[]; removed: string[] } = {
      added: [],
      modified: [],
      removed: [],
    };

    // Check if the event is a push to the main branch
    if (
      headers.get('x-github-event') === 'push' &&
      body.ref === 'refs/heads/main'
    ) {
      // process the updates
      // added files
      for (const commit of body.head_commit.added) {
        debug.added.push(commit);
      }
      // modified files
      for (const commit of body.head_commit.modified) {
        debug.modified.push(commit);
      }
      // removed files
      for (const commit of body.head_commit.removed) {
        debug.removed.push(commit);
      }

      return NextResponse.json(
        {
          status: 'success',
          headers: Object.fromEntries(headers),
          debug,
          payload: body,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        error: 'Invalid request',
        headers: Object.fromEntries(headers),
        payload: body,
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: `error in api (/api/update): ${error.message}`,
      },
      { status: 500 }
    );
  }
}

export const GET = async () => {
  return NextResponse.json(
    { error: 'GET method not allowed' },
    { status: 405 }
  );
};
