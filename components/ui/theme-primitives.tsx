import type { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export function PageShell({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('min-h-screen bg-muted py-8', className)}>{children}</div>;
}

export function PageContainer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

export function SurfaceCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-border bg-background shadow-sm', className)} {...props} />;
}

export function SubtlePanel({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-border bg-surface p-6', className)} {...props} />;
}

export function HighlightBanner({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6',
        className
      )}
      {...props}
    />
  );
}
