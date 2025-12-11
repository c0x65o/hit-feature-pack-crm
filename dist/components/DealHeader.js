'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
export function DealHeader({ deal, stageName, contactName, companyName }) {
    const { Card, Badge } = useUi();
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
    return (_jsx("div", { className: "mb-6", children: _jsx(Card, { children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "mb-2 text-2xl font-bold", children: deal.dealName }), _jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(DollarSign, { size: 20, className: "text-gray-500" }), _jsx("span", { className: "text-2xl font-bold", children: formatCurrency(deal.amount?.toString() || null) })] }), deal.closeDateEstimate && (_jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Calendar, { size: 16 }), _jsxs("span", { children: ["Close: ", new Date(deal.closeDateEstimate).toLocaleDateString()] })] }))] }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [stageName && (_jsxs(Badge, { variant: "default", children: [_jsx(TrendingUp, { size: 14, className: "mr-1" }), stageName] })), companyName && (_jsx(Badge, { variant: "default", children: companyName })), contactName && (_jsx(Badge, { variant: "default", children: contactName }))] })] }) }) }) }));
}
//# sourceMappingURL=DealHeader.js.map