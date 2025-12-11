'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart3, DollarSign, TrendingUp } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmMetrics } from '../hooks/useCrmMetrics';
export function PipelineMetrics() {
    const { Card } = useUi();
    const { data: metrics, loading } = useCrmMetrics();
    if (loading || !metrics) {
        return null;
    }
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };
    const cards = [
        {
            label: 'Pipeline Value',
            value: formatCurrency(metrics.pipeline.totalValue),
            icon: BarChart3,
            iconColor: 'text-blue-500',
        },
        {
            label: 'Won Value',
            value: formatCurrency(metrics.pipeline.wonValue),
            icon: DollarSign,
            iconColor: 'text-green-500',
            valueColor: 'text-green-600',
        },
        {
            label: 'Recent Conversions',
            value: metrics.leads.recentConversions,
            subtitle: 'Last 30 days',
            icon: TrendingUp,
            iconColor: 'text-purple-500',
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: cards.map((card) => {
            const Icon = card.icon;
            return (_jsx(Card, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground mb-1", children: card.label }), _jsx("p", { className: `text-2xl font-bold ${card.valueColor || ''}`, children: card.value }), card.subtitle && (_jsx("p", { className: "text-xs text-muted-foreground mt-1", children: card.subtitle }))] }), _jsx(Icon, { className: `${card.iconColor} w-8 h-8` })] }) }, card.label));
        }) }));
}
//# sourceMappingURL=PipelineMetrics.js.map