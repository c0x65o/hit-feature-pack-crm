'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUi } from '@hit/ui-kit';
import { useCrmMetrics } from '../hooks/useCrmMetrics';
export function LeadsByStatusChart() {
    const { Card, EmptyState } = useUi();
    const { data: metrics, loading } = useCrmMetrics();
    const formatStatusName = (status) => {
        return status
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };
    if (loading) {
        return null;
    }
    const statuses = metrics?.leads?.byStatus || [];
    return (_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Leads by Status" }), statuses.length === 0 ? (_jsx(EmptyState, { title: "No leads yet", description: "New contacts will appear here as leads" })) : (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-2", children: statuses.map((item) => (_jsxs("div", { className: "p-3 bg-muted rounded-lg text-center", children: [_jsx("p", { className: "text-xl font-bold", children: item.count }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: formatStatusName(item.status) })] }, item.status))) }))] }));
}
//# sourceMappingURL=LeadsByStatusChart.js.map