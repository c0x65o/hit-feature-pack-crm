'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRouter } from 'next/navigation';
import { useUi } from '@hit/ui-kit';
import { StuckDealsWidget } from '../components/StuckDealsWidget';
import { ActivityFeed } from '../components/ActivityFeed';
import { SummaryCards } from '../components/SummaryCards';
import { PipelineMetrics } from '../components/PipelineMetrics';
import { OpportunitiesByStageChart } from '../components/OpportunitiesByStageChart';
import { LeadsByStatusChart } from '../components/LeadsByStatusChart';
import { DealsWeeklyChart } from '../components/DealsWeeklyChart';
export function Dashboard() {
    const router = useRouter();
    const { Page, Card, Button } = useUi();
    const navigate = (path) => router.push(path);
    return (_jsxs(Page, { title: "CRM Dashboard", description: "Manage companies, contacts, and deals", actions: _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "secondary", onClick: () => navigate('/crm/companies/new'), children: "New Company" }), _jsx(Button, { variant: "secondary", onClick: () => navigate('/crm/contacts/new'), children: "New Contact" }), _jsx(Button, { variant: "primary", onClick: () => navigate('/crm/deals/new'), children: "New Deal" })] }), children: [_jsx("div", { className: "mb-6", children: _jsx(SummaryCards, {}) }), _jsx("div", { className: "mb-6", children: _jsx(PipelineMetrics, {}) }), _jsx("div", { className: "mb-6", children: _jsx(DealsWeeklyChart, {}) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6", children: [_jsx(Card, { children: _jsx(StuckDealsWidget, {}) }), _jsx(OpportunitiesByStageChart, {}), _jsx(LeadsByStatusChart, {})] }), _jsx(Card, { children: _jsx(ActivityFeed, { limit: 15 }) })] }));
}
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map