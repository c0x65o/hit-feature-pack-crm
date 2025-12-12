'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUi } from '@hit/ui-kit';
import { TaskWidget } from '../components/TaskWidget';
import { StuckDealsWidget } from '../components/StuckDealsWidget';
import { ActivityFeed } from '../components/ActivityFeed';
import { SummaryCards } from '../components/SummaryCards';
import { PipelineMetrics } from '../components/PipelineMetrics';
import { OpportunitiesByStageChart } from '../components/OpportunitiesByStageChart';
import { LeadsByStatusChart } from '../components/LeadsByStatusChart';
export function Dashboard({ onNavigate }) {
    const { Page, Card, Button, Alert, Spinner } = useUi();
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    return (_jsxs(Page, { title: "CRM Dashboard", description: "Manage leads, opportunities, contacts, and accounts", actions: _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "secondary", onClick: () => navigate('/crm/contacts/new'), children: "New Contact" }), _jsx(Button, { variant: "primary", onClick: () => navigate('/crm/deals/new'), children: "New Deal" })] }), children: [_jsx("div", { className: "mb-6", children: _jsx(SummaryCards, { onNavigate: onNavigate }) }), _jsx("div", { className: "mb-6", children: _jsx(PipelineMetrics, {}) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsx(Card, { children: _jsx(TaskWidget, {}) }), _jsx(Card, { children: _jsx(StuckDealsWidget, {}) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6", children: [_jsx(OpportunitiesByStageChart, {}), _jsx(LeadsByStatusChart, {})] }), _jsx(Card, { children: _jsx(ActivityFeed, { limit: 15 }) })] }));
}
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map