import { FileText } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Rules and guidelines for using Volunity DZ</p>
        </div>
      </div>

      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Acceptance of Terms</h2>
          <p>By accessing and using Volunity DZ, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide accurate and up-to-date information</li>
            <li>Use the platform respectfully and responsibly</li>
            <li>Not engage in harassment, spam, or abusive behavior</li>
            <li>Not attempt to bypass security measures</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Content Guidelines</h2>
          <p>Users are solely responsible for the content they post. Prohibited content includes hate speech, explicit material, misinformation, and content that violates the rights of others.</p>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Limitation of Liability</h2>
          <p>Volunity DZ is provided &quot;as is&quot; without warranties of any kind. We are not responsible for any damages arising from the use of the platform.</p>
        </GlassCard>
      </div>
    </div>
  );
}
