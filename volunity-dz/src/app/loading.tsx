import { SkeletonGrid } from '@/components/skeletons';

export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="h-8 w-64 bg-white/5 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-96 bg-white/5 rounded-full mx-auto animate-pulse" />
        </div>
        <SkeletonGrid count={6} />
      </div>
    </div>
  );
}
