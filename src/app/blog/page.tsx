import Link from 'next/link';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { posts } from './posts';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Blog - Any2PDF',
  description:
    'Tips, guides, and explanations about converting, merging, splitting, compressing, and protecting your documents with Any2PDF.',
};

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <section className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
            Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Guides and tips for working with PDFs, conversions, and document security.
          </p>
        </section>
        <section className="max-w-4xl mx-auto space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <Card className="transition-colors hover:border-primary">
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Badge variant="secondary"><FileText className="mr-1 h-3 w-3" /> Article</Badge>
                    <span>{post.date}</span>
                  </div>
                  <CardTitle className="text-2xl font-headline">{post.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-primary font-medium">
                  Read more →
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}