'use client';

import React from 'react';
import { BarChart3, DollarSign, TrendingUp } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmMetrics } from '../hooks/useCrmMetrics';

export function PipelineMetrics() {
  const { Card } = useUi();
  const { data: metrics, loading } = useCrmMetrics();

  if (loading || !metrics) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cards = [
    {
      label: 'Pipeline Value',
      value: formatCurrency(metrics.pipeline.totalValue),
      icon: BarChart3,
      iconColor: 'text-blue-500',
    },
    {
      label: 'Won Value',
      value: formatCurrency(metrics.pipeline.wonValue),
      icon: DollarSign,
      iconColor: 'text-green-500',
      valueColor: 'text-green-600',
    },
    {
      label: 'Recent Conversions',
      value: metrics.leads.recentConversions,
      subtitle: 'Last 30 days',
      icon: TrendingUp,
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                <p className={`text-2xl font-bold ${card.valueColor || ''}`}>
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.subtitle}
                  </p>
                )}
              </div>
              <Icon className={`${card.iconColor} w-8 h-8`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

