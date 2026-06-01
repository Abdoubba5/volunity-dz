import { Shield } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">How we handle your data</p>
        </div>
      </div>

      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Information We Collect</h2>
          <p>When you register for Volunity DZ, we collect your name, email address, university affiliation, faculty, department, and academic year. This information is used to provide you with relevant campus events and connect you with fellow students.</p>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To personalize your event recommendations</li>
            <li>To verify your student status</li>
            <li>To send you event reminders and notifications</li>
            <li>To improve our platform and user experience</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Data Protection</h2>
          <p>We implement appropriate security measures to protect your personal information. Your data is stored securely and is only accessible to authorized personnel.</p>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Contact</h2>
          <p>If you have questions about this privacy policy, please contact us at privacy@volunity.dz</p>
        </GlassCard>
      </div>
    </div>
  );
}
