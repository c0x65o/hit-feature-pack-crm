'use client';

import React from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmMetrics } from '../hooks/useCrmMetrics';

export function LeadsByStatusChart() {
  const { Card, EmptyState } = useUi();
  const { data: metrics, loading } = useCrmMetrics();

  const formatStatusName = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return null;
  }

  const statuses = metrics?.leads?.byStatus || [];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Leads by Status</h3>
      {statuses.length === 0 ? (
        <EmptyState
          title="No leads yet"
          description="New contacts will appear here as leads"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {statuses.map((item) => (
            <div
              key={item.status}
              className="p-3 bg-muted rounded-lg text-center"
            >
              <p className="text-xl font-bold">{item.count}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatStatusName(item.status)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

