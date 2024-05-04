import mime from 'mime-types';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import path from 'path';
import * as util from 'util';

import { commitFileToBranch, getAllFiles, getFileContent } from '@/lib/Github';
import { getLogger } from '@/lib/Logger';

const logger = getLogger().child({ namespace: 'API:/api/content/github' });

export const config = {
  api: {
    responseLimit: '8mb',
  },
};

export async function GET(req: NextRequest) {
  logger.info(
    `[GET /api/content/github][query]: ${util.inspect(Object.fromEntries(req.nextUrl.searchParams))}`,
  );
  try {
    const {
      owner,
      repo,
      branch = 'main',
      path: filepath,
    } = Object.fromEntries(req.nextUrl.searchParams);
    logger.info(
      `[GET /api/content/github][query]: branch:${branch}, path:${filepath}, owner:${owner}, repo:${repo}`,
    );
    if (!owner || !repo || typeof filepath !== 'string') {
      return NextResponse.json(
        { error: 'Missing required parameters: owner, repo, or path' },
        { status: 400 },
      );
    }

    if (filepath.endsWith('/')) {
      // Remove trailing slash
      const trimmedPath = filepath.slice(0, -1);
      const files = await getAllFiles(owner, repo, branch, trimmedPath);

      return NextResponse.json({ files });
    }
    const data = await getFileContent(owner, repo, branch, filepath);
    const extension = path.extname(filepath);
    const contentType = mime.lookup(extension) || 'application/octet-stream';
    logger.info(`[GET /api/content/github][data]: ${util.inspect(data)}`);

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    if (data?.content) {
      return new NextResponse(
        data?.content,
        // Buffer.from(data?.content.toString(), data.encoding as BufferEncoding),
        { status: 200, statusText: 'OK', headers },
      );
    }
    return NextResponse.json(
      { error: `File not found: ${filepath}` },
      { status: 404 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Error in API: ${err}` },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse | void> {
  try {
    const {
      owner,
      repo,
      branch = 'main',
      path: filepath,
    } = Object.fromEntries(req.nextUrl.searchParams);

    if (!owner || !repo || typeof filepath !== 'string') {
      return NextResponse.json(
        { error: 'Missing required parameters: owner, repo, or path' },
        { status: 400 },
      );
    }

    const { content, message } = JSON.parse(
      req?.body ? req.body.toString() : '',
    );
    if (!content || !message) {
      return NextResponse.json(
        {
          error: 'Missing required parameters: content or message in the body',
        },
        { status: 400 },
      );
    }
    const commitResponse = await commitFileToBranch(
      owner,
      repo,
      branch,
      filepath,
      content,
      message,
    );
    NextResponse.json({ response: commitResponse }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: `Error in API: ${err}` },
      { status: 500 },
    );
  }
}
