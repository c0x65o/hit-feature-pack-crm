'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUi } from '@hit/ui-kit';
import { useCrmMetrics } from '../hooks/useCrmMetrics';
export function OpportunitiesByStageChart() {
    const { Card, EmptyState } = useUi();
    const { data: metrics, loading } = useCrmMetrics();
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    const formatStageName = (stage) => {
        return stage
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };
    if (loading) {
        return null;
    }
    const stages = metrics?.opportunities?.byStage || [];
    return (_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Opportunities by Stage" }), stages.length === 0 ? (_jsx(EmptyState, { title: "No opportunities yet", description: "Create your first deal to see it here" })) : (_jsx("div", { className: "space-y-2", children: stages.map((item) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-muted rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: formatStageName(item.stage) }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [item.count, " opportunity", item.count !== 1 ? 'ies' : ''] })] }), _jsx("p", { className: "text-lg font-semibold", children: formatCurrency(item.totalAmount) })] }, item.stage))) }))] }));
}
//# sourceMappingURL=OpportunitiesByStageChart.js.map