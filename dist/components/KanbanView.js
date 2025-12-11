'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { useCrmPipelineStages } from '../hooks/useCrmPipelineStages';
export function KanbanView({ onDealUpdate }) {
    const { Card, Badge, Spinner, EmptyState } = useUi();
    const { data: deals, loading: dealsLoading, updateDeal } = useCrmDeals({});
    const { data: stages, loading: stagesLoading } = useCrmPipelineStages();
    const [draggedDeal, setDraggedDeal] = useState(null);
    const loading = dealsLoading || stagesLoading;
    const handleDragStart = (dealId) => {
        setDraggedDeal(dealId);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = async (stageId) => {
        if (!draggedDeal)
            return;
        try {
            await updateDeal(draggedDeal, { pipelineStage: stageId, stageEnteredAt: new Date() });
            if (onDealUpdate) {
                onDealUpdate(draggedDeal, stageId);
            }
        }
        catch (error) {
            console.error('Failed to update deal stage', error);
        }
        finally {
            setDraggedDeal(null);
        }
    };
    const formatCurrency = (amount) => {
        if (!amount)
            return '$0';
        const num = parseFloat(amount);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };
    if (loading) {
        return _jsx(Spinner, {});
    }
    if (!stages || stages.length === 0) {
        return (_jsx(Card, { children: _jsxs("div", { className: "text-center py-12", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-2", children: "No pipeline stages configured" }), _jsx("p", { className: "text-gray-400 mb-6", children: "You need to set up pipeline stages before you can use the Kanban view." }), _jsx("button", { onClick: () => window.location.href = '/crm/pipeline-stages', className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Setup Pipeline Stages" })] }) }));
    }
    // Group deals by stage
    const dealsArray = deals?.items || [];
    const dealsByStage = stages.reduce((acc, stage) => {
        acc[stage.id] = dealsArray.filter((deal) => deal.pipelineStage === stage.id);
        return acc;
    }, {});
    return (_jsx("div", { className: "flex gap-4 overflow-x-auto pb-4", children: stages.map((stage) => {
            const stageDeals = dealsByStage[stage.id] || [];
            const totalValue = stageDeals.reduce((sum, deal) => {
                return sum + (parseFloat(deal.amount?.toString() || '0'));
            }, 0);
            return (_jsx("div", { className: "min-w-[300px] flex-shrink-0", onDragOver: handleDragOver, onDrop: () => handleDrop(stage.id), children: _jsxs(Card, { children: [_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "text-lg font-semibold", children: stage.name }), _jsx(Badge, { variant: "default", children: stageDeals.length })] }), _jsx("div", { className: "text-sm text-gray-500", children: formatCurrency(totalValue.toString()) })] }), _jsx("div", { className: "space-y-2", children: stageDeals.map((deal) => (_jsxs("div", { className: "p-3 cursor-move hover:shadow-md transition-shadow border border-gray-200 rounded", draggable: true, onDragStart: () => handleDragStart(deal.id), children: [_jsx("div", { className: "font-medium mb-1", children: deal.dealName }), _jsx("div", { className: "text-sm text-gray-500", children: formatCurrency(deal.amount?.toString() || null) }), deal.primaryContactId && (_jsx("div", { className: "text-xs text-gray-400 mt-1", children: "Contact linked" }))] }, deal.id))) })] }) }, stage.id));
        }) }));
}
//# sourceMappingURL=KanbanView.js.map