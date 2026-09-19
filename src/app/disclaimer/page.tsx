import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Disclaimer - Any2PDF',
  description:
    'Read the Any2PDF disclaimer covering general information, conversion accuracy, and limitation of liability.',
};

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-semibold text-foreground">1. General Information</h2>
            <p>
              The information provided by Any2PDF (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) on any2pdf.com (the &quot;Site&quot;) is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
            </p>

            <h2 className="text-xl font-semibold text-foreground">2. No Professional Advice</h2>
            <p>
              The content on the Site is not a substitute for professional advice, whether legal, financial, technical, or otherwise. You should not rely solely on the content on this Site when making decisions. Always consult with appropriate professionals before taking action based on the information found here.
            </p>

            <h2 className="text-xl font-semibold text-foreground">3. External Links Disclaimer</h2>
            <p>
              The Site may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites. The inclusion of any link does not imply endorsement by us.
            </p>

            <h2 className="text-xl font-semibold text-foreground">4. Conversion Accuracy</h2>
            <p>
              While we strive to deliver high-quality file conversions, we do not guarantee that conversions will be error-free, accurate, or complete. File conversion results may vary depending on the source file&apos;s structure, formatting, and content. You are solely responsible for verifying the integrity of converted files.
            </p>

            <h2 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
            <p>
              Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the Site or reliance on any information provided on the Site. Your use of the Site and your reliance on any information on the Site is solely at your own risk.
            </p>

            <h2 className="text-xl font-semibold text-foreground">6. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this disclaimer, please feel free to contact us through our{" "}
              <a href="/contact" className="text-primary underline underline-offset-4">Contact page</a>.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}