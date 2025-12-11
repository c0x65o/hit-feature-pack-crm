'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';

export function StuckDealsWidget() {
  const { Card, Badge, Spinner, EmptyState, Button } = useUi();
  const { data: deals, loading } = useCrmDeals({});

  const stuckDeals = deals?.items?.filter((deal: { stageEnteredAt?: string | Date; dealName: string; companyId?: string | null; id: string }) => {
    if (!deal.stageEnteredAt) return false;
    const daysInStage = Math.floor(
      (Date.now() - new Date(deal.stageEnteredAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysInStage > 7;
  }) || [];

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <AlertTriangle size={20} />
        Stuck Deals
      </h3>

      {loading ? (
        <Spinner />
      ) : stuckDeals.length === 0 ? (
        <EmptyState
          title="No stuck deals"
          description="All deals are moving forward!"
        />
      ) : (
        <>
          <div className="mb-4">
            <Badge variant="warning">
              {stuckDeals.length} deal{stuckDeals.length !== 1 ? 's' : ''} stuck
            </Badge>
          </div>
          <ul className="space-y-2">
            {stuckDeals.map((deal: { id: string; dealName: string; companyId?: string | null }) => (
              <li key={deal.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{deal.dealName}</div>
                  <div className="text-sm text-gray-500">
                    {deal.companyId ? 'Company' : 'No company'}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Navigate to deal detail
                    if (typeof window !== 'undefined') {
                      window.location.href = `/crm/deals/${deal.id}`;
                    }
                  }}
                >
                  View
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

