'use server';

import React from 'react';

import { LandingPage } from '@/components/Layouts';

// export const metadata: Metadata = {
//   title: 'Airview',
//   description: 'Airview AI',
// };

export default async function Home() {
  // const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

  return (
    <main>
      <LandingPage />
    </main>
  );
}
