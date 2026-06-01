'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Calendar,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Sparkles,
  Users,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { getEventService } from '@/lib/services';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/auth-components';
import type { Locale } from '@/i18n/config';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  location: z.string().min(1, 'Location is required'),
  date: z.string().min(1, 'Date and time is required'),
  category: z.string().min(1, 'Category is required'),
  image_url: z.string().optional(),
  max_participants: z.coerce.number().int().min(1, 'Must allow at least 1 participant'),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORIES = ['education', 'environment', 'health', 'culture', 'sports', 'social'] as const;

const STEPS = [
  { id: 1, key: 'step1', icon: FileText },
  { id: 2, key: 'step2', icon: Calendar },
  { id: 3, key: 'step3', icon: CheckCircle2 },
];

const stepFields: Record<number, (keyof FormValues)[]> = {
  1: ['title', 'description', 'category'],
  2: ['date', 'location', 'max_participants'],
  3: [],
};

export default function CreateEventPage() {
  const t = useTranslations('events.create');
  const tCommon = useTranslations('common');
  const tCategories = useTranslations('events.categories_list');
  const router = useRouter();
  const locale = useLocale() as Locale;
  const { toast } = useToast();
  const { profile } = useAuth();

  const [step, setStep] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      date: '',
      category: 'education',
      image_url: '',
      max_participants: 50,
    },
  });

  const values = watch();

  const handleNext = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (!valid) return;
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!profile) return;
    setSubmitting(true);
    try {
      const eventSvc = getEventService();
      await eventSvc.createEvent({
        title: data.title,
        description: data.description,
        location: data.location,
        date: new Date(data.date).toISOString(),
        category: data.category,
        image_url: data.image_url || null,
        max_participants: data.max_participants,
        created_by: profile.id,
      });
      toast({ title: 'Event created!', description: 'Your event is now live.' });
      router.push(`/${locale}/events`);
    } catch {
      toast({ title: 'Error', description: 'Failed to create event', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <Badge variant="glass" className="mb-4 gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Create
            </Badge>
            <h1 className="display-2 mb-3">
              <span className="gradient-text">{t('title')}</span>
            </h1>
            <p className="text-muted-foreground">
              Share your initiative with thousands of volunteers
            </p>
          </motion.div>

          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 start-0 end-0 h-0.5 bg-white/10 -z-0" />
              <motion.div
                className="absolute top-5 start-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-accent -z-0"
                initial={{ width: '0%' }}
                animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.4 }}
              />

              {STEPS.map((s) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isComplete = step > s.id;
                return (
                  <div
                    key={s.id}
                    className="relative z-10 flex flex-col items-center gap-2"
                  >
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      className={cn(
                        'h-10 w-10 rounded-full flex items-center justify-center transition-colors',
                        isComplete
                          ? 'bg-gradient-to-br from-brand-primary to-brand-accent text-white'
                          : isActive
                            ? 'bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-lg glow-primary'
                            : 'glass text-muted-foreground'
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </motion.div>
                    <span
                      className={cn(
                        'text-xs font-medium hidden sm:block',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {t(s.key)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <GlassCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {step === 1 && (
                    <>
                      <div>
                        <h2 className="text-xl font-bold mb-1">{t('step1')}</h2>
                        <p className="text-sm text-muted-foreground">
                          Start with the essentials
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">{t('fields.title')} *</Label>
                        <Input
                          id="title"
                          placeholder="Beach Cleanup at Sablette"
                          {...register('title')}
                        />
                        {errors.title && (
                          <p className="text-xs text-destructive">{errors.title.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>{t('fields.category')} *</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setValue('category', cat)}
                              className={cn(
                                'p-3 rounded-xl text-sm font-medium transition-all',
                                values.category === cat
                                  ? 'bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-lg'
                                  : 'glass hover:bg-white/10'
                              )}
                            >
                              {tCategories(cat)}
                            </button>
                          ))}
                        </div>
                        <input type="hidden" {...register('category')} />
                        {errors.category && (
                          <p className="text-xs text-destructive">{errors.category.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">{t('fields.description')} *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what volunteers will do..."
                          {...register('description')}
                          rows={5}
                        />
                        {errors.description && (
                          <p className="text-xs text-destructive">{errors.description.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <h2 className="text-xl font-bold mb-1">{t('step2')}</h2>
                        <p className="text-sm text-muted-foreground">
                          When and where will it happen?
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">{t('fields.date')} *</Label>
                        <Input
                          id="date"
                          type="datetime-local"
                          {...register('date')}
                        />
                        {errors.date && (
                          <p className="text-xs text-destructive">{errors.date.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">{t('fields.location')} *</Label>
                        <Input
                          id="location"
                          placeholder="Sablette Beach"
                          {...register('location')}
                        />
                        {errors.location && (
                          <p className="text-xs text-destructive">{errors.location.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="max_participants">{t('fields.capacity')} *</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="max_participants"
                            type="number"
                            min={1}
                            className="flex-1"
                            {...register('max_participants')}
                          />
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        {errors.max_participants && (
                          <p className="text-xs text-destructive">{errors.max_participants.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div>
                        <h2 className="text-xl font-bold mb-1">{t('step3')}</h2>
                        <p className="text-sm text-muted-foreground">
                          Add a cover image and review your event
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>{t('fields.image')}</Label>
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <p className="text-sm font-medium mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image_url">Or paste an image URL</Label>
                        <Input
                          id="image_url"
                          placeholder="https://..."
                          {...register('image_url')}
                        />
                      </div>

                      <GlassCard className="bg-white/[0.02]">
                        <h3 className="font-bold text-lg mb-2">
                          {values.title || 'Untitled Event'}
                        </h3>
                        <Badge variant="default" className="capitalize mb-3">
                          {tCategories(values.category)}
                        </Badge>
                        <p className="text-sm text-muted-foreground mb-4">
                          {values.description || 'No description'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p className="font-medium">
                              {values.date
                                ? new Date(values.date).toLocaleString(locale)
                                : 'Not set'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="font-medium">{values.location || 'Not set'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Capacity</p>
                            <p className="font-medium">{values.max_participants} volunteers</p>
                          </div>
                        </div>
                      </GlassCard>

                      <div className="glass p-4 rounded-xl flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Ready to publish?</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Your event will be visible to thousands of volunteers and promoted via AI recommendations.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => step > 1 && setStep(step - 1)}
                  disabled={step === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4 rtl-flip" />
                  {tCommon('back')}
                </Button>

                {step < 3 ? (
                  <Button type="button" variant="gradient" onClick={handleNext} className="gap-2">
                    {tCommon('next')}
                    <ArrowRight className="h-4 w-4 rtl-flip" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="gradient"
                    disabled={submitting}
                    className="gap-2 glow-primary"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {submitting ? 'Creating...' : 'Publish event'}
                  </Button>
                )}
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </ProtectedRoute>
  );
}
