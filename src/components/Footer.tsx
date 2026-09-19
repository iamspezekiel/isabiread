
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-700 bg-neutral-900 text-neutral-400">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="tape-label text-neutral-500">IsabiRead AI · Side B</span>
          <span className="hidden h-1 w-8 rounded-full bg-neutral-700 sm:block" />
          <span className="text-sm">Your library, on tape.</span>
        </div>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/about" className="transition-colors hover:text-neutral-100">About</Link>
          <Link href="/pricing" className="transition-colors hover:text-neutral-100">Pricing</Link>
          <Link href="/support" className="transition-colors hover:text-neutral-100">Support</Link>
          <Link href="/user-guide" className="transition-colors hover:text-neutral-100">User Guide</Link>
        </nav>
      </div>
      <div className="border-t border-neutral-800 py-3 text-center font-mono text-[11px] text-neutral-600">
        Copyright &copy; {new Date().getFullYear()} IsabiRead AI. All Rights Reserved.
      </div>
    </footer>
  );
}
