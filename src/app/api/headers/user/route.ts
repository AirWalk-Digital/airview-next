import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { getLogger } from '@/lib/Logger';

const logger = getLogger().child({ namespace: 'Editor' });
logger.level = 'debug';

const decodeJWT = (token: string): JwtPayload | null => {
  try {
    const cleanedToken = token.replace(/=/g, '');
    const decodedToken = jwt.decode(cleanedToken) as JwtPayload;

    return decodedToken;
  } catch (error) {
    logger.error('Failed to decode JWT', error);
    return null;
  }
};

export async function GET() {
  try {
    const userToken = headers().get('x-amzn-oidc-data');
    const randomUserName = `ABC-${Math.floor(Math.random() * 100)}`;

    if (userToken == null) {
      logger.debug('No token in header, setting random user name');
      return NextResponse.json(randomUserName, {
        status: 200,
        statusText: 'OK',
      });
    }

    const decoded = decodeJWT(userToken);
    if (decoded != null) {
      return NextResponse.json(decoded.name, {
        status: 200,
        statusText: 'OK',
      });
    }

    return NextResponse.json(randomUserName, {
      status: 200,
      statusText: 'OK',
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Error in API: ${err}` },
      { status: 500 }
    );
  }
}
