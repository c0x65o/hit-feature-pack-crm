'use client';

import React, { useState } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { useCrmPipelineStages } from '../hooks/useCrmPipelineStages';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface KanbanViewProps {
  onDealUpdate?: (dealId: string, newStageId: string) => void;
}

interface Deal {
  id: string;
  dealName: string;
  amount?: string | number | null;
  primaryContactId?: string | null;
  companyId?: string | null;
  closeDateEstimate?: string | Date | null;
  stageEnteredAt?: string | Date | null;
  pipelineStage: string;
}

interface Stage {
  id: string;
  name: string;
  order: number;
  isClosedWon: boolean;
  isClosedLost: boolean;
}

function DealCard({ deal, onDealClick }: { deal: Deal; onDealClick?: (dealId: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `deal:${deal.id}`,
    data: { type: 'deal', dealId: deal.id, stageId: deal.pipelineStage },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) return '$0';
    const num = parseFloat(amount.toString());
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getDaysInStage = () => {
    if (!deal.stageEnteredAt) return null;
    const entered = new Date(deal.stageEnteredAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - entered.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysInStage = getDaysInStage();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 cursor-move hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
      onClick={() => onDealClick?.(deal.id)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <div
          {...attributes}
          {...listeners}
          style={{ cursor: 'grab', padding: '4px', marginTop: '2px' }}
          aria-label="Drag handle"
        >
          <GripVertical size={16} style={{ color: 'var(--hit-muted-foreground)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-medium mb-1" style={{ color: 'var(--hit-foreground)' }}>
            {deal.dealName}
          </div>
          <div className="text-sm mb-1" style={{ color: 'var(--hit-muted-foreground)' }}>
            {formatCurrency(deal.amount)}
          </div>
          {daysInStage !== null && (
            <div className="text-xs" style={{ color: 'var(--hit-muted-foreground)' }}>
              {daysInStage} {daysInStage === 1 ? 'day' : 'days'} in stage
            </div>
          )}
          {deal.closeDateEstimate && (
            <div className="text-xs mt-1" style={{ color: 'var(--hit-muted-foreground)' }}>
              Close: {new Date(deal.closeDateEstimate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StageColumn({
  stage, 
  deals, 
  onDealClick 
}: { 
  stage: Stage; 
  deals: Deal[]; 
  onDealClick?: (dealId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stage:${stage.id}`,
    data: { type: 'stage', stageId: stage.id },
  });

  const formatCurrency = (amount: string | number | null | undefined) => {
    if (!amount) return '$0';
    const num = parseFloat(amount.toString());
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const totalValue = deals.reduce((sum, deal) => {
    return sum + (parseFloat(deal.amount?.toString() || '0'));
  }, 0);

  const averageAge = deals.length > 0
    ? Math.round(
        deals.reduce((sum, deal) => {
          if (!deal.stageEnteredAt) return sum;
          const entered = new Date(deal.stageEnteredAt);
          const now = new Date();
          const diffDays = Math.ceil(Math.abs(now.getTime() - entered.getTime()) / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        }, 0) / deals.length
      )
    : 0;

  return (
    <div
      ref={setNodeRef}
      className="min-w-[300px] flex-shrink-0"
    >
      <div
        className="p-4 rounded-lg border mb-4"
        style={{
          backgroundColor: 'var(--hit-muted)',
          borderColor: isOver ? 'var(--hit-primary, #3b82f6)' : 'var(--hit-border)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold" style={{ color: 'var(--hit-foreground)' }}>
            {stage.name}
          </h4>
        </div>
        <div className="text-sm mb-2" style={{ color: 'var(--hit-muted-foreground)' }}>
          <div>{deals.length} {deals.length === 1 ? 'deal' : 'deals'}</div>
          <div>{formatCurrency(totalValue.toString())} total</div>
          {averageAge > 0 && <div>Avg. {averageAge} {averageAge === 1 ? 'day' : 'days'}</div>}
        </div>
      </div>

      <div className="space-y-2" style={{ minHeight: '100px' }}>
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onDealClick={onDealClick} />
        ))}
      </div>
    </div>
  );
}

export function KanbanView({ onDealUpdate }: KanbanViewProps) {
  const { Card, Spinner } = useUi();
  const { data: dealsData, loading: dealsLoading, updateDeal } = useCrmDeals({});
  const { data: stages, loading: stagesLoading } = useCrmPipelineStages();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [optimisticDeals, setOptimisticDeals] = useState<Deal[] | null>(null);

  const loading = dealsLoading || stagesLoading;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const deals = optimisticDeals || (dealsData?.items || []);
  const sortedStages = stages ? [...stages].sort((a, b) => a.order - b.order) : [];

  // Group deals by stage
  const dealsByStage = sortedStages.reduce((acc: Record<string, Deal[]>, stage) => {
    acc[stage.id] = deals.filter((deal: Deal) => deal.pipelineStage === stage.id);
    return acc;
  }, {} as Record<string, Deal[]>);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const activeType = active.data.current?.type;
    if (activeType !== 'deal') return;

    const activeDealId = active.data.current?.dealId as string | undefined;
    const fromStageId = active.data.current?.stageId as string | undefined;
    if (!activeDealId || !fromStageId) return;

    const overType = over.data.current?.type;
    const toStageId =
      overType === 'stage'
        ? (over.data.current?.stageId as string | undefined)
        : undefined;

    if (!toStageId || toStageId === fromStageId) return;

    // Optimistic update
    const updatedDeals = deals.map((deal: Deal) =>
      deal.id === activeDealId
        ? { ...deal, pipelineStage: toStageId, stageEnteredAt: new Date() }
        : deal
    );
    setOptimisticDeals(updatedDeals);

    try {
      await updateDeal(activeDealId, {
        pipelineStage: toStageId,
      });

      onDealUpdate?.(activeDealId, toStageId);
    } catch (error) {
      console.error('Failed to update deal stage', error);
      setOptimisticDeals(null);
    } finally {
      setTimeout(() => setOptimisticDeals(null), 500);
    }
  };

  const handleDealClick = (dealId: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/crm/deals/${dealId}`;
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!stages || stages.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--hit-foreground)' }}>
            No pipeline stages configured
          </h3>
          <p className="mb-6" style={{ color: 'var(--hit-muted-foreground)' }}>
            You need to set up pipeline stages before you can use the Kanban view.
          </p>
          <button
            onClick={() => window.location.href = '/crm/pipeline-stages'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Setup Pipeline Stages
          </button>
        </div>
      </Card>
    );
  }

  const activeDeal = activeId?.startsWith('deal:')
    ? deals.find((d: Deal) => d.id === activeId.replace('deal:', ''))
    : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {sortedStages.map((stage) => {
          const stageDeals = dealsByStage[stage.id] || [];
          return (
            <StageColumn
              key={stage.id}
              stage={stage}
              deals={stageDeals}
              onDealClick={handleDealClick}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeDeal ? (
          <div
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
            style={{ width: '300px' }}
          >
            <div className="font-medium mb-1">{activeDeal.dealName}</div>
            <div className="text-sm" style={{ color: 'var(--hit-muted-foreground)' }}>
              {activeDeal.amount
                ? new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(parseFloat(activeDeal.amount.toString()))
                : '$0'}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
