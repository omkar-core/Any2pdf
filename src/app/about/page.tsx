import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">About Any2PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Welcome to Any2PDF, your all-in-one solution for seamless and secure file conversions. Our mission is to provide a powerful, intuitive, and reliable tool that simplifies the process of converting various file formats into high-quality PDFs.
            </p>
            <p>
              In today's fast-paced digital world, the need for a universal document format is more critical than ever. PDF has emerged as the standard for sharing and archiving documents, ensuring that your files look the same on any device. However, converting different file types—from office documents to images—can often be a cumbersome task. Any2PDF was created to solve this problem.
            </p>
            <p>
              We leverage cutting-edge technology, including advanced conversion APIs and the power of Generative AI, to deliver precise and efficient conversions. Our platform supports a wide range of file types, including DOCX, XLSX, PPTX, PNG, JPG, and TIFF. Whether you're a student, a professional, or anyone in between, Any2PDF is designed to meet your needs with features like bulk processing, real-time progress tracking, and robust security options.
            </p>
            <p>
              At Any2PDF, we are committed to user privacy and data security. We utilize Firebase for secure storage and authentication, ensuring that your files and personal information are always protected. Our goal is to provide a service you can trust, with a user-friendly experience that makes file conversion a breeze.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
