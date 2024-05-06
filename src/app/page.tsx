'use server';

import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Airview',
  description: 'Airview AI',
};

export default async function Home() {
  // const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

  return (
    <main>
      <h2>test</h2>
    </main>
  );
}
