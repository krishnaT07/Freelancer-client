import React, { Suspense } from 'react';
import MessagesClient from './MessagesClient';

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessagesClient />
    </Suspense>
  );
}
