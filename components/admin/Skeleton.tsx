'use client';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="h-12 bg-slate-50 border-b border-slate-100 mb-4"></div>
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-4 h-4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="aspect-square rounded-xl overflow-hidden relative">
          <Skeleton className="w-full h-full" />
          <div className="absolute bottom-3 left-3">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
