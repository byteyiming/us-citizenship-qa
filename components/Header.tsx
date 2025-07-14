import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-lg">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sparkles className="text-blue-500 h-7 w-7" />
            <span className="font-extrabold text-xl tracking-tight">Citizenship Pro</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}