'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRouter } from 'next/navigation';
import { Building, Users, TrendingUp } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmMetrics } from '../hooks/useCrmMetrics';
export function SummaryCards() {
    const router = useRouter();
    const { Card, Button } = useUi();
    const { data: metrics, loading } = useCrmMetrics();
    const navigate = (path) => router.push(path);
    if (loading || !metrics) {
        return null;
    }
    const cards = [
        {
            label: 'Companies',
            value: metrics.totals.companies,
            icon: Building,
            iconColor: 'text-blue-500',
            path: '/crm/companies',
        },
        {
            label: 'Contacts',
            value: metrics.totals.contacts,
            icon: Users,
            iconColor: 'text-purple-500',
            path: '/crm/contacts',
        },
        {
            label: 'Deals',
            value: metrics.totals.deals,
            icon: TrendingUp,
            iconColor: 'text-green-500',
            path: '/crm/deals',
        },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: cards.map((card) => {
            const Icon = card.icon;
            return (_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground mb-1", children: card.label }), _jsx("p", { className: "text-2xl font-bold", children: card.value })] }), _jsx(Icon, { className: `${card.iconColor} w-8 h-8` })] }), _jsx("div", { className: "mt-2", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate(card.path), children: "View All" }) })] }, card.label));
        }) }));
}
//# sourceMappingURL=SummaryCards.js.map