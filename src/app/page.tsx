import { FileUploader } from '@/components/file-uploader';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
            Any2PDF
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            The ultimate tool for converting your files. Securely convert office
            documents and images to high-quality PDFs in just a few clicks.
          </p>
        </section>
        <section className="mt-8 md:mt-12 max-w-3xl mx-auto">
          <FileUploader />
        </section>
      </main>
      <Footer />
    </div>
  );
}
