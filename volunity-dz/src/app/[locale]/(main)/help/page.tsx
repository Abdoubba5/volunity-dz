import { Shield, BookOpen, Mail } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Help Center</h1>
          <p className="text-sm text-muted-foreground">Find answers to common questions</p>
        </div>
      </div>

      <div className="space-y-4">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-3">Getting Started</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong>How do I create an account?</strong> Click &quot;Get started&quot; on the homepage, fill in your university details, and verify your email.</p>
            <p><strong>How do I join an event?</strong> Browse events on the Events page, click an event, and click &quot;Join event&quot;. You will receive a reminder before the event starts.</p>
            <p><strong>How is attendance tracked?</strong> At the event, scan the QR code displayed by the organizer to mark your attendance.</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-3">Account & Profile</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong>How do I update my profile?</strong> Go to Settings from your profile dropdown to update your name, university, faculty, and other details.</p>
            <p><strong>Can I change my email?</strong> Email changes are managed through your account settings. You will need to verify the new email address.</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-3">Events & Participation</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong>Can I create an event?</strong> Yes! Click the &quot;+&quot; button or navigate to Events and click &quot;Create event&quot;. Fill in the details and submit.</p>
            <p><strong>How do I cancel my participation?</strong> Go to the event page and click &quot;Leave event&quot;. Your spot will be freed for other students.</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-3">Still need help?</h2>
          <p className="text-sm text-muted-foreground mb-3">Contact us and we will get back to you as soon as possible.</p>
          <a href="mailto:support@volunity.dz" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <Mail className="h-4 w-4" />
            support@volunity.dz
          </a>
        </GlassCard>
      </div>
    </div>
  );
}
