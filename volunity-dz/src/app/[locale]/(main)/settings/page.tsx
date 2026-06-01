'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  User,
  Bell,
  Lock,
  Globe,
  Palette,
  Shield,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Check,
  Mail,
  Smartphone,
  Eye,
  Trash2,
  Download,
  LogOut,
  Sparkles,
  Users,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

const SECTIONS = [
  { id: 'account', icon: User, label: 'Account' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'privacy', icon: Lock, label: 'Privacy' },
  { id: 'language', icon: Globe, label: 'Language' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'security', icon: Shield, label: 'Security' },
];

const LANGUAGES = [
  { code: 'ar', name: 'العربية', flag: '🇩🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const { theme, setTheme } = useTheme();
  const [active, setActive] = React.useState('account');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const renderAccount = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Account Information</h2>
        <p className="text-sm text-muted-foreground">Update your personal information</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
          SK
        </div>
        <div>
          <Button variant="glass" size="sm">Change photo</Button>
          <p className="text-xs text-muted-foreground mt-2">JPG, PNG up to 5MB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('fields.name')}</Label>
          <Input id="name" defaultValue="Sarah Khaled" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">{t('fields.email')}</Label>
          <Input id="email" type="email" defaultValue="sarah.k@example.com" className="mt-1.5" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="bio">{t('fields.bio')}</Label>
          <textarea
            id="bio"
            rows={3}
            defaultValue="Passionate about environmental causes and community building."
            className="mt-1.5 w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <Label htmlFor="university">{t('fields.university')}</Label>
          <Input id="university" defaultValue="USTHB" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="city">{t('fields.city')}</Label>
          <Input id="city" defaultValue="Algiers" className="mt-1.5" />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="glass">{tCommon('cancel')}</Button>
        <Button variant="gradient">{tCommon('save')}</Button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Notifications</h2>
        <p className="text-sm text-muted-foreground">Manage how you receive notifications</p>
      </div>

      <div className="space-y-4">
        {[
          { icon: Mail, title: 'Email notifications', desc: 'Receive emails for important updates', defaultChecked: true },
          { icon: Smartphone, title: 'Push notifications', desc: 'Get push notifications on your device', defaultChecked: true },
          { icon: Bell, title: 'Event reminders', desc: 'Reminders 24h and 2h before events', defaultChecked: true },
          { icon: Sparkles, title: 'New badges', desc: 'Notify me when I earn a new badge', defaultChecked: true },
          { icon: Users, title: 'Social updates', desc: 'New followers, comments, and mentions', defaultChecked: false },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.defaultChecked} />
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Privacy</h2>
        <p className="text-sm text-muted-foreground">Control your privacy settings</p>
      </div>

      <div className="space-y-4">
        {[
          { title: 'Public profile', desc: 'Anyone can view your profile', defaultChecked: true },
          { title: 'Show my events', desc: 'Display events I join on my profile', defaultChecked: true },
          { title: 'Show my badges', desc: 'Display earned badges publicly', defaultChecked: true },
          { title: 'Allow messages', desc: 'Let other users send you messages', defaultChecked: false },
          { title: 'Show online status', desc: 'Display when you are online', defaultChecked: true },
        ].map((item) => (
          <GlassCard key={item.title} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
            <Switch defaultChecked={item.defaultChecked} />
          </GlassCard>
        ))}
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-bold">Data & Privacy</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="glass" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download my data
          </Button>
          <Button variant="glass" size="sm" className="gap-2 text-red-500 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLanguage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Language & Region</h2>
        <p className="text-sm text-muted-foreground">Choose your preferred language</p>
      </div>

      <div className="space-y-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            className={cn(
              'w-full p-4 rounded-xl glass flex items-center gap-4 text-start transition-colors',
              locale === lang.code ? 'border-primary/50 bg-primary/5' : 'hover:bg-white/5'
            )}
          >
            <span className="text-3xl">{lang.flag}</span>
            <div className="flex-1">
              <p className="font-medium">{lang.name}</p>
              <p className="text-xs text-muted-foreground">{lang.code.toUpperCase()}</p>
            </div>
            {locale === lang.code && (
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Appearance</h2>
        <p className="text-sm text-muted-foreground">Customize how the app looks</p>
      </div>

      <div>
        <h3 className="font-bold mb-3">{t('theme.title')}</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', icon: Sun, label: t('theme.light'), preview: 'bg-white' },
            { id: 'dark', icon: Moon, label: t('theme.dark'), preview: 'bg-slate-900' },
            { id: 'system', icon: Monitor, label: t('theme.system'), preview: 'bg-gradient-to-r from-white to-slate-900' },
          ].map((opt) => {
            const isActive = mounted && theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={cn(
                  'p-4 rounded-2xl glass flex flex-col items-center gap-2 transition-all',
                  isActive ? 'border-primary/50 bg-primary/5' : 'hover:bg-white/5'
                )}
              >
                <div className={cn('h-16 w-full rounded-lg mb-2 border border-white/10', opt.preview)} />
                <opt.icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span className="text-sm font-medium">{opt.label}</span>
                {isActive && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-bold mb-3">Accent color</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { name: 'Ocean', gradient: 'from-primary to-secondary' },
            { name: 'Sunset', gradient: 'from-orange-500 to-pink-500' },
            { name: 'Forest', gradient: 'from-emerald-500 to-teal-500' },
            { name: 'Royal', gradient: 'from-purple-500 to-indigo-500' },
            { name: 'Crimson', gradient: 'from-red-500 to-rose-500' },
          ].map((color, i) => (
            <button
              key={color.name}
              className={cn(
                'h-12 w-12 rounded-2xl bg-gradient-to-br transition-transform',
                color.gradient,
                i === 0 ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110' : 'hover:scale-110'
              )}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Security</h2>
        <p className="text-sm text-muted-foreground">Protect your account</p>
      </div>

      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Password</p>
            <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
          </div>
          <Button variant="glass" size="sm">Change</Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Two-factor authentication</p>
            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
          </div>
          <Switch />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Login alerts</p>
            <p className="text-sm text-muted-foreground">Get notified of new logins</p>
          </div>
          <Switch defaultChecked />
        </div>
      </GlassCard>

      <div>
        <h3 className="font-bold mb-3">Active sessions</h3>
        <div className="space-y-2">
          {[
            { device: 'iPhone 15 Pro', location: 'Algiers, Algeria', current: true },
            { device: 'Chrome on MacOS', location: 'Algiers, Algeria', current: false },
          ].map((session) => (
            <GlassCard key={session.device} className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium flex items-center gap-2">
                  {session.device}
                  {session.current && <Badge variant="success">Current</Badge>}
                </p>
                <p className="text-xs text-muted-foreground">{session.location}</p>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-red-500">
                  Revoke
                </Button>
              )}
            </GlassCard>
          ))}
        </div>
      </div>

      <Button variant="glass" className="gap-2 text-red-500">
        <LogOut className="h-4 w-4" />
        Sign out of all devices
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="display-2 mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <GlassCard className="p-2 lg:sticky lg:top-24">
            <nav className="space-y-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActive(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    active === section.id
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-foreground'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  )}
                >
                  <section.icon className="h-4 w-4" />
                  <span className="flex-1 text-start">{t(`sections.${section.id}`)}</span>
                  <ChevronRight className="h-3.5 w-3.5 rtl-flip" />
                </button>
              ))}
            </nav>
          </GlassCard>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          <GlassCard className="p-6 sm:p-8">
            {active === 'account' && renderAccount()}
            {active === 'notifications' && renderNotifications()}
            {active === 'privacy' && renderPrivacy()}
            {active === 'language' && renderLanguage()}
            {active === 'appearance' && renderAppearance()}
            {active === 'security' && renderSecurity()}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
