'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AlertTriangle } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
export function StuckDealsWidget() {
    const { Card, Badge, Spinner, EmptyState, Button } = useUi();
    const { data: deals, loading } = useCrmDeals({});
    const stuckDeals = deals?.items?.filter((deal) => {
        if (!deal.stageEnteredAt)
            return false;
        const daysInStage = Math.floor((Date.now() - new Date(deal.stageEnteredAt).getTime()) / (1000 * 60 * 60 * 24));
        return daysInStage > 7;
    }) || [];
    return (_jsxs("div", { children: [_jsxs("h3", { className: "mb-4 flex items-center gap-2 text-lg font-semibold", children: [_jsx(AlertTriangle, { size: 20 }), "Stuck Deals"] }), loading ? (_jsx(Spinner, {})) : stuckDeals.length === 0 ? (_jsx(EmptyState, { title: "No stuck deals", description: "All deals are moving forward!" })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "mb-4", children: _jsxs(Badge, { variant: "warning", children: [stuckDeals.length, " deal", stuckDeals.length !== 1 ? 's' : '', " stuck"] }) }), _jsx("ul", { className: "space-y-2", children: stuckDeals.map((deal) => (_jsxs("li", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", children: deal.dealName }), _jsx("div", { className: "text-sm text-gray-500", children: deal.companyId ? 'Company' : 'No company' })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                        // Navigate to deal detail
                                        if (typeof window !== 'undefined') {
                                            window.location.href = `/crm/deals/${deal.id}`;
                                        }
                                    }, children: "View" })] }, deal.id))) })] }))] }));
}
//# sourceMappingURL=StuckDealsWidget.js.map