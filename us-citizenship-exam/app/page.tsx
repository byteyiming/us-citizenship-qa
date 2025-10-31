export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Select your language</h1>
      <div className="mt-4 flex gap-3">
        <a className="underline" href="/en">English</a>
        <a className="underline" href="/es">Español</a>
        <a className="underline" href="/zh">中文</a>
        </div>
    </div>
  );
}
