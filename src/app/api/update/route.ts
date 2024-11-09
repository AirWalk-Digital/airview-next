// app/api/update/route.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getAllFiles, removeFile, reprocessFile } from '@/lib/Cache';

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
      const addedPromises = body.head_commit.added.map((commit: string) => {
        debug.added.push(commit);
        return reprocessFile({
          backend: 'github',
          owner: body.repository.owner.name,
          repo: body.repository.name,
          path: commit,
          branch: 'main',
        });
      });
      await Promise.all(addedPromises);
      // modified files

      const modifiedPromises = body.head_commit.modified.map(
        (commit: string) => {
          debug.modified.push(commit);
          return reprocessFile({
            backend: 'github',
            owner: body.repository.owner.name,
            repo: body.repository.name,
            path: commit,
            branch: 'main',
          });
        }
      );
      await Promise.all(modifiedPromises);

      // removed files
      const removedPromises = body.head_commit.removed.map((commit: string) => {
        debug.removed.push(commit);
        return removeFile({
          backend: 'github',
          owner: body.repository.owner.name,
          repo: body.repository.name,
          path: commit,
          type: 'published',
        });
      });
      await Promise.all(removedPromises);

      return NextResponse.json(
        {
          status: 'success',
          // headers: Object.fromEntries(headers),
          debug,
          payload: body,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        error: 'Invalid request',
        // headers: Object.fromEntries(headers),
        debug,
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

export const GET = async (req: NextRequest) => {
  const { secret, owner, repo } = Object.fromEntries(req.nextUrl.searchParams);
  if (secret !== process.env.GITHUB_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  if (!owner || !repo) {
    return NextResponse.json(
      { error: 'Missing required parameters: owner, repo' },
      { status: 400 }
    );
  }
  const files = await getAllFiles({ owner, repo, filter: '.md*' });
  files.forEach((file) => {
    reprocessFile({
      backend: 'github',
      owner,
      repo,
      path: file.path,
      branch: 'main',
    });
  });
  return NextResponse.json(
    { message: 'Processed All Files', files },
    { status: 200 }
  );
};
