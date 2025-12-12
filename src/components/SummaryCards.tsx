'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building, Users, TrendingUp } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmMetrics } from '../hooks/useCrmMetrics';

export function SummaryCards() {
  const router = useRouter();
  const { Card, Button } = useUi();
  const { data: metrics, loading } = useCrmMetrics();

  const navigate = (path: string) => router.push(path);

  if (loading || !metrics) {
    return null;
  }

  const cards = [
    {
      label: 'Companies',
      value: metrics.totals.companies,
      icon: Building,
      iconColor: 'text-blue-500',
      path: '/crm/companies',
    },
    {
      label: 'Contacts',
      value: metrics.totals.contacts,
      icon: Users,
      iconColor: 'text-purple-500',
      path: '/crm/contacts',
    },
    {
      label: 'Deals',
      value: metrics.totals.deals,
      icon: TrendingUp,
      iconColor: 'text-green-500',
      path: '/crm/deals',
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
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <Icon className={`${card.iconColor} w-8 h-8`} />
            </div>
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(card.path)}
              >
                View All
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

