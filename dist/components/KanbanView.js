'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { useCrmPipelineStages } from '../hooks/useCrmPipelineStages';
import { DndContext, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors, useDraggable, useDroppable, } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
function DealCard({ deal, onDealClick }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `deal:${deal.id}`,
        data: { type: 'deal', dealId: deal.id, stageId: deal.pipelineStage },
    });
    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };
    const formatCurrency = (amount) => {
        if (!amount)
            return '$0';
        const num = parseFloat(amount.toString());
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };
    const getDaysInStage = () => {
        if (!deal.stageEnteredAt)
            return null;
        const entered = new Date(deal.stageEnteredAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - entered.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    const daysInStage = getDaysInStage();
    return (_jsx("div", { ref: setNodeRef, style: style, className: "p-3 cursor-move hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800", onClick: () => onDealClick?.(deal.id), children: _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' }, children: [_jsx("div", { ...attributes, ...listeners, style: { cursor: 'grab', padding: '4px', marginTop: '2px' }, "aria-label": "Drag handle", children: _jsx(GripVertical, { size: 16, style: { color: 'var(--hit-muted-foreground)' } }) }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { className: "font-medium mb-1", style: { color: 'var(--hit-foreground)' }, children: deal.dealName }), _jsx("div", { className: "text-sm mb-1", style: { color: 'var(--hit-muted-foreground)' }, children: formatCurrency(deal.amount) }), daysInStage !== null && (_jsxs("div", { className: "text-xs", style: { color: 'var(--hit-muted-foreground)' }, children: [daysInStage, " ", daysInStage === 1 ? 'day' : 'days', " in stage"] })), deal.closeDateEstimate && (_jsxs("div", { className: "text-xs mt-1", style: { color: 'var(--hit-muted-foreground)' }, children: ["Close: ", new Date(deal.closeDateEstimate).toLocaleDateString()] }))] })] }) }));
}
function StageColumn({ stage, deals, onDealClick }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `stage:${stage.id}`,
        data: { type: 'stage', stageId: stage.id },
    });
    const formatCurrency = (amount) => {
        if (!amount)
            return '$0';
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
        ? Math.round(deals.reduce((sum, deal) => {
            if (!deal.stageEnteredAt)
                return sum;
            const entered = new Date(deal.stageEnteredAt);
            const now = new Date();
            const diffDays = Math.ceil(Math.abs(now.getTime() - entered.getTime()) / (1000 * 60 * 60 * 24));
            return sum + diffDays;
        }, 0) / deals.length)
        : 0;
    return (_jsxs("div", { ref: setNodeRef, className: "min-w-[300px] flex-shrink-0", children: [_jsxs("div", { className: "p-4 rounded-lg border mb-4", style: {
                    backgroundColor: 'var(--hit-muted)',
                    borderColor: isOver ? 'var(--hit-primary, #3b82f6)' : 'var(--hit-border)',
                }, children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("h4", { className: "text-lg font-semibold", style: { color: 'var(--hit-foreground)' }, children: stage.name }) }), _jsxs("div", { className: "text-sm mb-2", style: { color: 'var(--hit-muted-foreground)' }, children: [_jsxs("div", { children: [deals.length, " ", deals.length === 1 ? 'deal' : 'deals'] }), _jsxs("div", { children: [formatCurrency(totalValue.toString()), " total"] }), averageAge > 0 && _jsxs("div", { children: ["Avg. ", averageAge, " ", averageAge === 1 ? 'day' : 'days'] })] })] }), _jsx("div", { className: "space-y-2", style: { minHeight: '100px' }, children: deals.map((deal) => (_jsx(DealCard, { deal: deal, onDealClick: onDealClick }, deal.id))) })] }));
}
export function KanbanView({ onDealUpdate }) {
    const { Card, Spinner } = useUi();
    const { data: dealsData, loading: dealsLoading, updateDeal } = useCrmDeals({});
    const { data: stages, loading: stagesLoading } = useCrmPipelineStages();
    const [activeId, setActiveId] = useState(null);
    const [optimisticDeals, setOptimisticDeals] = useState(null);
    const loading = dealsLoading || stagesLoading;
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    const deals = optimisticDeals || (dealsData?.items || []);
    const sortedStages = stages ? [...stages].sort((a, b) => a.order - b.order) : [];
    // Group deals by stage
    const dealsByStage = sortedStages.reduce((acc, stage) => {
        acc[stage.id] = deals.filter((deal) => deal.pipelineStage === stage.id);
        return acc;
    }, {});
    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };
    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over || active.id === over.id) {
            return;
        }
        const activeType = active.data.current?.type;
        if (activeType !== 'deal')
            return;
        const activeDealId = active.data.current?.dealId;
        const fromStageId = active.data.current?.stageId;
        if (!activeDealId || !fromStageId)
            return;
        const overType = over.data.current?.type;
        const toStageId = overType === 'stage'
            ? over.data.current?.stageId
            : undefined;
        if (!toStageId || toStageId === fromStageId)
            return;
        // Optimistic update
        const updatedDeals = deals.map((deal) => deal.id === activeDealId
            ? { ...deal, pipelineStage: toStageId, stageEnteredAt: new Date() }
            : deal);
        setOptimisticDeals(updatedDeals);
        try {
            await updateDeal(activeDealId, {
                pipelineStage: toStageId,
            });
            onDealUpdate?.(activeDealId, toStageId);
        }
        catch (error) {
            console.error('Failed to update deal stage', error);
            setOptimisticDeals(null);
        }
        finally {
            setTimeout(() => setOptimisticDeals(null), 500);
        }
    };
    const handleDealClick = (dealId) => {
        if (typeof window !== 'undefined') {
            window.location.href = `/crm/deals/${dealId}`;
        }
    };
    if (loading) {
        return _jsx(Spinner, {});
    }
    if (!stages || stages.length === 0) {
        return (_jsx(Card, { children: _jsxs("div", { className: "text-center py-12", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", style: { color: 'var(--hit-foreground)' }, children: "No pipeline stages configured" }), _jsx("p", { className: "mb-6", style: { color: 'var(--hit-muted-foreground)' }, children: "You need to set up pipeline stages before you can use the Kanban view." }), _jsx("button", { onClick: () => window.location.href = '/crm/pipeline-stages', className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Setup Pipeline Stages" })] }) }));
    }
    const activeDeal = activeId?.startsWith('deal:')
        ? deals.find((d) => d.id === activeId.replace('deal:', ''))
        : null;
    return (_jsxs(DndContext, { sensors: sensors, onDragStart: handleDragStart, onDragEnd: handleDragEnd, children: [_jsx("div", { className: "flex gap-4 overflow-x-auto pb-4", children: sortedStages.map((stage) => {
                    const stageDeals = dealsByStage[stage.id] || [];
                    return (_jsx(StageColumn, { stage: stage, deals: stageDeals, onDealClick: handleDealClick }, stage.id));
                }) }), _jsx(DragOverlay, { children: activeDeal ? (_jsxs("div", { className: "p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg", style: { width: '300px' }, children: [_jsx("div", { className: "font-medium mb-1", children: activeDeal.dealName }), _jsx("div", { className: "text-sm", style: { color: 'var(--hit-muted-foreground)' }, children: activeDeal.amount
                                ? new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(parseFloat(activeDeal.amount.toString()))
                                : '$0' })] })) : null })] }));
}
//# sourceMappingURL=KanbanView.js.map