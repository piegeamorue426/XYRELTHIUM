'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'Aucune donnee a afficher',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (accessor: string) => {
    if (sortColumn === accessor) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(accessor);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-[#111118] p-12 text-center">
        <p className="text-white/40">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#111118]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            {columns.map((col) => (
              <th
                key={String(col.accessor)}
                className={cn(
                  'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/50',
                  col.sortable && 'cursor-pointer select-none hover:text-white/70'
                )}
                onClick={() => col.sortable && handleSort(String(col.accessor))}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortColumn === String(col.accessor) && (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr
              key={index}
              className={cn(
                'border-b border-white/5 last:border-0 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-white/[0.02]'
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td
                  key={String(col.accessor)}
                  className="px-4 py-3 text-sm text-white/80"
                >
                  {col.render
                    ? col.render(item)
                    : String(item[String(col.accessor)] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
