import { cn } from '@/common/libs';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-default-200', className)}
      {...props}
    />
  );
}

export { Skeleton };
