'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { KanbanView } from '../components/KanbanView';
export function DealList() {
    const { Page, Button, Tabs } = useUi();
    const [view, setView] = useState('kanban');
    return (_jsx(Page, { title: "Deals", description: "Manage your sales pipeline", actions: _jsxs(Button, { variant: "primary", onClick: () => window.location.href = '/crm/deals/new', children: [_jsx(Plus, { size: 16, className: "mr-2" }), "New Deal"] }), children: _jsx(Tabs, { activeTab: view, onChange: (tabId) => setView(tabId), tabs: [
                { id: 'kanban', label: 'Kanban', content: _jsx(KanbanView, {}) },
                { id: 'list', label: 'List', content: _jsx(DealListView, {}) },
            ] }) }));
}
function DealListView() {
    const { Card, DataTable, Spinner } = useUi();
    const { data, loading } = useCrmDeals({});
    return (_jsx(Card, { children: loading ? (_jsx(Spinner, {})) : (_jsx(DataTable, { columns: [
                { key: 'dealName', label: 'Deal Name', sortable: true },
                { key: 'amount', label: 'Amount', sortable: true },
                { key: 'closeDateEstimate', label: 'Close Date' },
            ], data: data?.items || [], onRowClick: (row) => {
                window.location.href = `/crm/deals/${row.id}`;
            } })) }));
}
export default DealList;
//# sourceMappingURL=DealList.js.map