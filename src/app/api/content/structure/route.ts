import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { siteConfig } from '@/config';
import { loadMenu, nestMenu } from '@/lib/Content/loadMenu';
import { getLogger } from '@/lib/Logger';

const logger = getLogger().child({ namespace: 'API:/api/content/structure' });
logger.level = 'error';
// export const config = {
//   api: {
//     responseLimit: '8mb',
//   },
// };

export async function GET(req: NextRequest) {
  try {
    const { collection } = Object.fromEntries(req.nextUrl.searchParams);

    if (!collection) {
      return NextResponse.json(
        { error: 'Missing required parameters: owner, repo, or path' },
        { status: 400 }
      );
    }

    // const docs = await getContent(
    //   siteConfig.content[collection as keyof typeof siteConfig.content]
    // );

    const content = await loadMenu(
      siteConfig,
      siteConfig.content[collection as keyof typeof siteConfig.content]
    );
    const { menu: docs } = nestMenu(content, 'docs') ?? {};
    logger.info(docs);
    if (docs) {
      return NextResponse.json(docs, { status: 200, statusText: 'OK' });
    }
    return NextResponse.json(
      { error: `Structure not found: ${collection}` },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Error in API: ${err}` },
      { status: 500 }
    );
  }
}
