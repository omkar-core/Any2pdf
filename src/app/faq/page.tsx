import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    question: 'What is Any2PDF?',
    answer:
      'Any2PDF is an all-in-one online toolkit for working with documents. You can convert files to PDF, merge and split PDFs, compress large PDFs, rotate pages, protect documents with passwords, add watermarks, and extract specific pages — all in your browser.',
  },
  {
    question: 'Which file types can I convert to PDF?',
    answer:
      'We support common office documents (DOC, DOCX, XLS, XLSX, PPT, PPTX), images (PNG, JPG, TIFF, BMP, GIF), HTML files, and PDFs themselves. PDFs can further be converted to editable formats such as DOCX, XLSX, PPTX, JPG, PNG, and PDF/A.',
  },
  {
    question: 'Is there a limit on file size or the number of files?',
    answer:
      'Yes. Each file may be up to 25MB, and you can process up to 10 files at a time in the bulk converter.',
  },
  {
    question: 'Are my files secure?',
    answer:
      'Privacy and security are a top priority. Uploaded files are processed over an encrypted connection, stored on secure infrastructure only for the time needed to complete your conversion, and automatically deleted after a short retention period.',
  },
  {
    question: 'Are there any costs to use Any2PDF?',
    answer:
      'Any2PDF is free to start. You get a limited number of free conversions daily. Premium plans offer unlimited conversions and additional features such as advanced compression and priority processing.',
  },
  {
    question: 'Do you store the content of my files?',
    answer:
      'We do not access the content of your files except as necessary to perform the requested conversion. Files are automatically removed from our servers shortly after processing.',
  },
  {
    question: 'Why is my scanned image not producing selectable text?',
    answer:
      'Scanned images contain no embedded text. We run OCR (Optical Character Recognition) on supported images so that the text in your output PDF becomes selectable and copyable. OCR quality depends on the resolution and clarity of the original scan.',
  },
  {
    question: 'How can I merge multiple PDFs into one?',
    answer:
      'Open the Merge tool, drag in your PDF files, arrange them in the order you want using the arrow buttons, then click "Run Merge PDFs". Your combined document will be ready to download instantly.',
  },
  {
    question: 'Where are my processed files downloaded?',
    answer:
      'Processed files are downloaded directly through your browser. You can save them anywhere on your device. They are never stored on our servers after download.',
  },
  {
    question: 'How do I contact support?',
    answer:
      'Visit our Contact page and send us a message. We aim to respond to all inquiries within 24–48 hours.',
  },
];

export const metadata: Metadata = {
  title: 'FAQ - Any2PDF',
  description:
    'Answers to common questions about Any2PDF: supported file types, limits, security, pricing, OCR, and more.',
};

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Frequently Asked Questions</CardTitle>
            <CardDescription>
              Answers to the most common questions about Any2PDF.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}