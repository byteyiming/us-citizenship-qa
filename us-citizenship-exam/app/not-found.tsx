export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl p-6 text-center">
      <h1 className="mb-2 text-3xl font-bold">Page not found</h1>
      <p className="text-slate-600">The page you are looking for does not exist.</p>
      <a href="/en" className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Back to Home</a>
    </div>
  );
}


