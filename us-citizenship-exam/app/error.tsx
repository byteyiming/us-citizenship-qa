"use client";
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // TODO: add error reporting here
    // console.error(error);
  }, [error]);
  return (
    <html>
      <body className="mx-auto max-w-2xl p-6">
        <h2 className="mb-2 text-2xl font-bold text-red-600">Something went wrong</h2>
        <p className="mb-6 text-slate-700">Please try again. If the issue persists, refresh the page.</p>
        <button onClick={() => reset()} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Try again</button>
      </body>
    </html>
  );
}


