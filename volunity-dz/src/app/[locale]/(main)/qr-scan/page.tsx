'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  Camera,
  CheckCircle2,
  X,
  Flashlight,
  Image as ImageIcon,
  Type,
  RefreshCw,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Scan,
  Zap,
} from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Locale } from '@/i18n/config';

type ScanState = 'scanning' | 'success' | 'error';

export default function QrScanPage() {
  const t = useTranslations('events');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const [state, setState] = React.useState<ScanState>('scanning');
  const [torchOn, setTorchOn] = React.useState(false);

  const handleScan = () => {
    setState('success');
  };

  const handleReset = () => {
    setState('scanning');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 glow-primary">
            <Scan className="h-7 w-7 text-white" />
          </div>
          <h1 className="display-2 mb-2">QR Attendance</h1>
          <p className="text-muted-foreground">
            Scan the event QR code to mark your attendance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6 sm:p-8">
            {/* Camera viewfinder */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black mb-6">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20" />
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,183,255,0.3),transparent_50%)]" />
              </div>

              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Corner brackets */}
              <div className="absolute inset-12">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-2xl" />
              </div>

              {/* Scan line */}
              <AnimatePresence>
                {state === 'scanning' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-12 overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                      style={{ boxShadow: '0 0 20px rgba(0, 183, 255, 0.8)' }}
                      animate={{ y: [0, 240, 0] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result overlay */}
              <AnimatePresence mode="wait">
                {state === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 backdrop-blur-sm"
                  >
                    <div className="bg-emerald-500/20 backdrop-blur-md rounded-full p-6">
                      <CheckCircle2 className="h-20 w-20 text-emerald-400" fill="currentColor" />
                    </div>
                  </motion.div>
                )}
                {state === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm"
                  >
                    <div className="bg-red-500/20 backdrop-blur-md rounded-full p-6">
                      <X className="h-20 w-20 text-red-400" strokeWidth={3} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Camera icon placeholder */}
              {state === 'scanning' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Camera className="h-16 w-16 text-white/20" />
                </div>
              )}
            </div>

            {/* Status */}
            <AnimatePresence mode="wait">
              {state === 'scanning' && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center mb-6"
                >
                  <Badge variant="glass" className="mb-2 gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Looking for QR code
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Position the QR code within the frame
                  </p>
                </motion.div>
              )}

              {state === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center mb-6"
                >
                  <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-3 bg-emerald-500/10 border-emerald-500/30">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-500">
                      Attendance confirmed!
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-1">You&apos;re checked in 🎉</h2>
                  <p className="text-sm text-muted-foreground">
                    Your attendance has been recorded
                  </p>
                </motion.div>
              )}

              {state === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center mb-6"
                >
                  <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-3 bg-red-500/10 border-red-500/30">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-500">
                      Scan failed
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-1">Try again</h2>
                  <p className="text-sm text-muted-foreground">
                    Make sure the QR code is well lit
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {state === 'scanning' ? (
                <>
                  <Button
                    variant="glass"
                    onClick={() => setTorchOn(!torchOn)}
                    className={cn('gap-2', torchOn && 'bg-amber-500/20 border-amber-500/30')}
                  >
                    <Flashlight className={cn('h-4 w-4', torchOn && 'text-amber-500')} />
                    {torchOn ? 'Torch on' : 'Torch'}
                  </Button>
                  <Button
                    variant="glass"
                    onClick={() => setState('error')}
                    className="gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    From gallery
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="glass"
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Scan again
                  </Button>
                  <Button
                    variant="gradient"
                    onClick={() => setState('scanning')}
                    className="gap-2"
                    asChild
                  >
                    <Link href={`/${locale}/events`}>
                      View event
                      <ArrowRight className="h-4 w-4 rtl-flip" />
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Demo helper */}
            {state === 'scanning' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleScan}
                className="w-full text-xs"
              >
                <Zap className="h-3 w-3 me-1" />
                Simulate scan
              </Button>
            )}

            {/* Manual code */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-muted-foreground mb-2">Or enter the code manually</p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Type className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="w-full ps-10 pe-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <Button variant="gradient" size="sm">
                  Submit
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
