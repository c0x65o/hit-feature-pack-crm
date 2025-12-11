'use client';

import React from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmMetrics } from '../hooks/useCrmMetrics';

export function OpportunitiesByStageChart() {
  const { Card, EmptyState } = useUi();
  const { data: metrics, loading } = useCrmMetrics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatStageName = (stage: string) => {
    return stage
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return null;
  }

  const stages = metrics?.opportunities?.byStage || [];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Opportunities by Stage</h3>
      {stages.length === 0 ? (
        <EmptyState
          title="No opportunities yet"
          description="Create your first deal to see it here"
        />
      ) : (
        <div className="space-y-2">
          {stages.map((item) => (
            <div
              key={item.stage}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div>
                <p className="font-medium">{formatStageName(item.stage)}</p>
                <p className="text-sm text-muted-foreground">
                  {item.count} opportunity{item.count !== 1 ? 'ies' : ''}
                </p>
              </div>
              <p className="text-lg font-semibold">
                {formatCurrency(item.totalAmount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

