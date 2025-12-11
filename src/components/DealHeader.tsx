'use client';

import React from 'react';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import type { CrmDeal } from '../schema/crm';

interface DealHeaderProps {
  deal: CrmDeal;
  stageName?: string;
  contactName?: string;
  companyName?: string;
}

export function DealHeader({ deal, stageName, contactName, companyName }: DealHeaderProps) {
  const { Card, Badge } = useUi();

  const formatCurrency = (amount: string | null) => {
    if (!amount) return '$0';
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="mb-6">
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold">
              {deal.dealName}
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-gray-500" />
                <span className="text-2xl font-bold">{formatCurrency(deal.amount?.toString() || null)}</span>
              </div>
              {deal.closeDateEstimate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span>Close: {new Date(deal.closeDateEstimate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {stageName && (
                <Badge variant="default">
                  <TrendingUp size={14} className="mr-1" />
                  {stageName}
                </Badge>
              )}
              {companyName && (
                <Badge variant="default">{companyName}</Badge>
              )}
              {contactName && (
                <Badge variant="default">{contactName}</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

