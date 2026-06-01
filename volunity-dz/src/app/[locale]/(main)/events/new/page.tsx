'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  X,
  Upload,
  Sparkles,
  Tag,
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
import type { Locale } from '@/i18n/config';
import type { EventCategory } from '@/types';

const STEPS = [
  { id: 1, key: 'step1', icon: FileText },
  { id: 2, key: 'step2', icon: Calendar },
  { id: 3, key: 'step3', icon: MapPin },
  { id: 4, key: 'step4', icon: CheckCircle2 },
];

const CATEGORIES: EventCategory[] = ['education', 'environment', 'health', 'culture', 'sports', 'social'];

interface FormData {
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  city: string;
  capacity: number;
  image: string;
  tags: string[];
}

export default function CreateEventPage() {
  const t = useTranslations('events.create');
  const tCommon = useTranslations('common');
  const tCategories = useTranslations('events.categories_list');
  const router = useRouter();
  const locale = useLocale() as Locale;
  const { toast } = useToast();

  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<FormData>({
    title: '',
    description: '',
    category: 'environment',
    date: '',
    time: '',
    location: '',
    city: '',
    capacity: 50,
    image: '',
    tags: [],
  });
  const [tagInput, setTagInput] = React.useState('');

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateField('tags', [...formData.tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    updateField(
      'tags',
      formData.tags.filter((t) => t !== tag)
    );
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    toast({
      title: 'Event created!',
      description: 'Your event is now live. Volunteers can start joining.',
    });
    setTimeout(() => {
      router.push(`/${locale}/events`);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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

        {/* Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
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
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
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

        {/* Form content */}
        <GlassCard>
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
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('fields.category')} *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => updateField('category', cat)}
                          className={cn(
                            'p-3 rounded-xl text-sm font-medium transition-all',
                            formData.category === cat
                              ? 'bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-lg'
                              : 'glass hover:bg-white/10'
                          )}
                        >
                          {tCategories(cat)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t('fields.description')} *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what volunteers will do..."
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length} / 500 characters
                    </p>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">{t('fields.date')} *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => updateField('date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">{t('fields.time')} *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => updateField('time', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">{t('fields.location')} *</Label>
                    <Input
                      id="location"
                      placeholder="Sablette Beach"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">{t('fields.city')} *</Label>
                    <Input
                      id="city"
                      placeholder="Algiers"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">{t('fields.capacity')} *</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="capacity"
                        type="number"
                        min={1}
                        value={formData.capacity}
                        onChange={(e) =>
                          updateField('capacity', parseInt(e.target.value) || 0)
                        }
                        className="flex-1"
                      />
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <h2 className="text-xl font-bold mb-1">{t('step3')}</h2>
                    <p className="text-sm text-muted-foreground">
                      Add visual appeal and discoverability
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
                    <Label htmlFor="image-url">Or paste an image URL</Label>
                    <Input
                      id="image-url"
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => updateField('image', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('fields.tags')}</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button type="button" variant="glass" size="icon" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="glass" className="gap-1 ps-3 pe-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ms-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div>
                    <h2 className="text-xl font-bold mb-1">{t('step4')}</h2>
                    <p className="text-sm text-muted-foreground">
                      Review and publish your event
                    </p>
                  </div>

                  <GlassCard className="bg-white/[0.02]">
                    <h3 className="font-bold text-lg mb-2">
                      {formData.title || 'Untitled Event'}
                    </h3>
                    <Badge variant="default" className="capitalize mb-3">
                      {tCategories(formData.category)}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4">
                      {formData.description || 'No description'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-medium">{formData.date || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="font-medium">{formData.time || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-medium">{formData.location || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">City</p>
                        <p className="font-medium">{formData.city || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Capacity</p>
                        <p className="font-medium">{formData.capacity} volunteers</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tags</p>
                        <p className="font-medium">
                          {formData.tags.length > 0
                            ? formData.tags.join(', ')
                            : 'None'}
                        </p>
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

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4 rtl-flip" />
              {tCommon('back')}
            </Button>

            {step < 4 ? (
              <Button variant="gradient" onClick={nextStep} className="gap-2">
                {tCommon('next')}
                <ArrowRight className="h-4 w-4 rtl-flip" />
              </Button>
            ) : (
              <Button
                variant="gradient"
                onClick={handleSubmit}
                className="gap-2 glow-primary"
              >
                <CheckCircle2 className="h-4 w-4" />
                Publish event
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
