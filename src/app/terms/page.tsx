import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By using Any2PDF (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
            
            <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p>Any2PDF provides users with tools to convert, merge, split, and manage digital files. You are responsible for all files you upload and process through the Service.</p>
            
            <h2 className="text-xl font-semibold text-foreground">3. User Conduct</h2>
            <p>You agree not to use the Service for any unlawful purpose or to upload any content that is illegal, harmful, or infringes on the rights of others. We reserve the right to terminate accounts that violate these terms.</p>

            <h2 className="text-xl font-semibold text-foreground">4. Intellectual Property</h2>
            <p>You retain ownership of the content you upload to the Service. By using the Service, you grant us a limited license to process your files as necessary to provide the features of the Service.</p>

            <h2 className="text-xl font-semibold text-foreground">5. Disclaimer of Warranties</h2>
            <p>The Service is provided "as is" without any warranties of any kind. We do not guarantee that the Service will be error-free or that conversions will be accurate or complete.</p>
            
            <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
            <p>In no event shall Any2PDF be liable for any indirect, incidental, or consequential damages arising out of your use of the Service.</p>

            <h2 className="text-xl font-semibold text-foreground">7. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Your continued use of the Service after any such changes constitutes your acceptance of the new terms.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
