'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Target, TrendingUp, Users, Briefcase, Activity } from 'lucide-react';
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
      label: 'Leads',
      value: metrics.totals.leads,
      icon: Target,
      iconColor: 'text-blue-500',
      path: '/crm/contacts', // Leads map to contacts in new CRM
    },
    {
      label: 'Opportunities',
      value: metrics.totals.opportunities,
      icon: TrendingUp,
      iconColor: 'text-green-500',
      path: '/crm/deals', // Opportunities map to deals in new CRM
    },
    {
      label: 'Contacts',
      value: metrics.totals.contacts,
      icon: Users,
      iconColor: 'text-purple-500',
      path: '/crm/contacts',
    },
    {
      label: 'Accounts',
      value: metrics.totals.accounts,
      icon: Briefcase,
      iconColor: 'text-orange-500',
      path: '/crm/companies', // Accounts map to companies in new CRM
    },
    {
      label: 'Activities',
      value: metrics.totals.activities,
      icon: Activity,
      iconColor: 'text-cyan-500',
      path: '/crm/activities',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

