import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-bg-surface-raised rounded-md ${className}`}></div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`p-6 bg-bg-surface rounded-xl border border-border-subtle ${className}`}>
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export function SkeletonTable({ columns = 4, rows = 5, className = '' }) {
  return (
    <div className={`bg-bg-surface rounded-xl border border-border-subtle overflow-hidden ${className}`}>
      <div className="p-6 border-b border-border-subtle">
        <Skeleton className="h-6 w-48" />
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-subtle bg-bg-surface-raised">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-4">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-border-subtle">
              {Array.from({ length: columns }).map((_, j) => (
                <td key={j} className="p-4">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
