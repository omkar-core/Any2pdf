import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, upload files, or contact us for support. This may include your name, email address, and any files you upload for conversion.</p>
            
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services. This includes processing file conversions, authenticating users, and responding to customer service requests. We do not access the content of your files except as necessary to provide the service.</p>
            
            <h2 className="text-xl font-semibold text-foreground">3. File Storage and Security</h2>
            <p>Files you upload are stored securely on Firebase Storage. We implement automated cleanup policies to permanently delete your files from our servers after a short retention period to protect your privacy. We take reasonable measures to protect your information from loss, theft, misuse, and unauthorized access.</p>

            <h2 className="text-xl font-semibold text-foreground">4. Third-Party Services</h2>
            <p>We may use third-party services like CloudConvert for file conversions and Stripe for payment processing. These services have their own privacy policies, and we encourage you to review them.</p>

            <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. You can manage your account information through your profile settings or by contacting us directly.</p>
            
            <h2 className="text-xl font-semibold text-foreground">6. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page. We encourage you to review this policy periodically for any changes.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
