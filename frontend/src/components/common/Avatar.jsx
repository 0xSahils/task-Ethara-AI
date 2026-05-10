import { avatarUrl } from '../../utils/getPriorityColor.js';

const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-sm', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' };

export default function Avatar({ name = 'U', size = 'md', className = '' }) {
  const seed = name.replace(/\s+/g, '');
  return (
    <img
      src={avatarUrl(seed)}
      alt={name}
      title={name}
      className={`rounded-full object-cover ring-2 ring-white shrink-0 bg-indigo-100 ${sizes[size]} ${className}`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0F3460&color=fff&size=64`;
      }}
    />
  );
}

export function AvatarGroup({ names = [], max = 3, size = 'sm' }) {
  const visible = names.slice(0, max);
  const extra = names.length - max;
  return (
    <div className="flex -space-x-2">
      {visible.map((name) => (
        <Avatar key={name} name={name} size={size} />
      ))}
      {extra > 0 && (
        <div className={`${sizes[size]} rounded-full bg-gray-200 text-gray-600 text-xs font-medium flex items-center justify-center ring-2 ring-white`}>
          +{extra}
        </div>
      )}
    </div>
  );
}
