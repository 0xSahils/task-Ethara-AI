// Skeleton loader for card grids
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-card p-5 shadow-card space-y-3 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gray-200" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-4/5" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-2 bg-gray-200 rounded w-1/4" />
        <div className="flex -space-x-1">
          {[0,1,2].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-200 ring-2 ring-white" />)}
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full w-full">
        <div className="h-1.5 bg-gray-200 rounded-full w-1/3" />
      </div>
    </div>
  );
}

// Spinner
export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-3', lg: 'w-12 h-12 border-4' };
  return (
    <div className={`${s[size]} border-accent border-t-transparent rounded-full animate-spin`} />
  );
}

// Full-page loader
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <Spinner size="lg" />
    </div>
  );
}
