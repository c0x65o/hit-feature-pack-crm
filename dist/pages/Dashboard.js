'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useUi } from '@hit/ui-kit';
export function Dashboard() {
    const { Page, Card, Spinner, Button } = useUi();
    React.useEffect(() => {
        if (typeof window === 'undefined')
            return;
        window.location.replace('/dashboards?pack=crm');
    }, []);
    return (_jsx(Page, { title: "CRM Dashboard", description: "Redirecting to dashboards\u2026", actions: _jsx(Button, { variant: "secondary", onClick: () => (window.location.href = '/dashboards?pack=crm'), children: "Open Dashboards" }), children: _jsx(Card, { children: _jsx("div", { style: { padding: 16 }, children: _jsx(Spinner, {}) }) }) }));
}
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map