'use client';

import React, { useState } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { useCrmPipelineStages } from '../hooks/useCrmPipelineStages';

interface KanbanViewProps {
  onDealUpdate?: (dealId: string, newStageId: string) => void;
}

export function KanbanView({ onDealUpdate }: KanbanViewProps) {
  const { Card, Badge, Spinner, EmptyState } = useUi();
  const { data: deals, loading: dealsLoading, updateDeal } = useCrmDeals({});
  const { data: stages, loading: stagesLoading } = useCrmPipelineStages();
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);

  const loading = dealsLoading || stagesLoading;

  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (stageId: string) => {
    if (!draggedDeal) return;

    try {
      await updateDeal(draggedDeal, { pipelineStage: stageId, stageEnteredAt: new Date() });
      if (onDealUpdate) {
        onDealUpdate(draggedDeal, stageId);
      }
    } catch (error) {
      console.error('Failed to update deal stage', error);
    } finally {
      setDraggedDeal(null);
    }
  };

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

  if (loading) {
    return <Spinner />;
  }

  if (!stages || stages.length === 0) {
    return (
      <EmptyState
        title="No pipeline stages configured"
        description="Configure pipeline stages to use the Kanban view"
      />
    );
  }

  // Group deals by stage
  const dealsByStage = stages.reduce((acc: Record<string, typeof deals>, stage) => {
    acc[stage.id] = deals?.filter((deal: { pipelineStage: string }) => deal.pipelineStage === stage.id) || [];
    return acc;
  }, {} as Record<string, typeof deals>);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageDeals = dealsByStage[stage.id] || [];
        const totalValue = stageDeals.reduce((sum: number, deal: { amount?: string | number | null }) => {
          return sum + (parseFloat(deal.amount?.toString() || '0'));
        }, 0);

        return (
          <div
            key={stage.id}
            className="min-w-[300px] flex-shrink-0"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stage.id)}
          >
            <Card>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold">{stage.name}</h4>
                  <Badge variant="default">{stageDeals.length}</Badge>
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(totalValue.toString())}
                </div>
              </div>

              <div className="space-y-2">
                {stageDeals.map((deal: { id: string; dealName: string; amount?: string | number | null; primaryContactId?: string | null }) => (
                  <div
                    key={deal.id}
                    className="p-3 cursor-move hover:shadow-md transition-shadow border border-gray-200 rounded"
                    draggable
                    onDragStart={() => handleDragStart(deal.id)}
                  >
                    <div className="font-medium mb-1">{deal.dealName}</div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(deal.amount?.toString() || null)}
                    </div>
                    {deal.primaryContactId && (
                      <div className="text-xs text-gray-400 mt-1">Contact linked</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

