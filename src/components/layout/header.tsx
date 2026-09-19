"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileBox } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-6">
          <FileBox className="h-6 w-6" style={{color: "hsl(var(--accent))"}} />
          <span className="font-headline">Any2PDF</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link
            href="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Blog
          </Link>
          <Link
            href="/faq"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Contact
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
            <Button asChild>
              <Link href="/#tools">Get Started</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
