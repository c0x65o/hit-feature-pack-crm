'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
import { useUi } from '@hit/ui-kit';
import { useCrmMetrics } from '../hooks/useCrmMetrics';
export function DealsWeeklyChart() {
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
    const formatWeekLabel = (weekDate) => {
        const date = new Date(weekDate);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const day = date.getDate();
        return `${month} ${day}`;
    };
    if (loading) {
        return null;
    }
    const weeklyData = metrics?.dealsWeekly || [];
    if (weeklyData.length === 0) {
        return (_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Deals Progress (Last 4 Weeks)" }), _jsx(EmptyState, { title: "No deals data yet", description: "Create your first deal to see progress here" })] }));
    }
    // Prepare chart data with formatted labels
    const chartData = weeklyData.map((item) => ({
        week: formatWeekLabel(item.week),
        count: item.count,
        amount: Number(item.totalAmount),
    }));
    return (_jsxs(Card, { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Deals Progress (Last 4 Weeks)" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "week" }), _jsx(YAxis, { yAxisId: "left" }), _jsx(YAxis, { yAxisId: "right", orientation: "right" }), _jsx(Tooltip, { formatter: (value, name) => {
                                if (name === 'amount') {
                                    return formatCurrency(value);
                                }
                                return value;
                            }, labelFormatter: (label) => `Week: ${label}` }), _jsx(Legend, {}), _jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "count", stroke: "#3b82f6", strokeWidth: 2, name: "Deals Count", dot: { r: 4 } }), _jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "amount", stroke: "#10b981", strokeWidth: 2, name: "Total Amount ($)", dot: { r: 4 } })] }) }), _jsx("div", { className: "mt-4 grid grid-cols-2 md:grid-cols-4 gap-2", children: chartData.map((item, idx) => (_jsxs("div", { className: "p-2 bg-muted rounded-lg text-center", children: [_jsx("p", { className: "text-xs text-muted-foreground mb-1", children: item.week }), _jsx("p", { className: "text-lg font-bold", children: item.count }), _jsx("p", { className: "text-xs text-muted-foreground", children: formatCurrency(item.amount) })] }, idx))) })] }));
}
//# sourceMappingURL=DealsWeeklyChart.js.map