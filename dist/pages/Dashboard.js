'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUi } from '@hit/ui-kit';
import { TaskWidget } from '../components/TaskWidget';
import { StuckDealsWidget } from '../components/StuckDealsWidget';
import { ActivityFeed } from '../components/ActivityFeed';
export function Dashboard() {
    const { Page, Card } = useUi();
    return (_jsx(Page, { title: "CRM Dashboard", description: "Your CRM overview and key metrics", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Card, { children: _jsx(TaskWidget, {}) }), _jsx(Card, { children: _jsx(StuckDealsWidget, {}) }), _jsx("div", { className: "col-span-1 md:col-span-3", children: _jsx(Card, { children: _jsx(ActivityFeed, { limit: 15 }) }) })] }) }));
}
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map