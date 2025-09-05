import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Any2PDF. All rights reserved.</p>
        <nav className="flex gap-4 mt-4 sm:mt-0">
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  );
}
