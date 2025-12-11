'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmActivities } from '../hooks/useCrmActivities';
export function ActivityList() {
    const { Page, Card, Button, DataTable, Spinner } = useUi();
    const { data, loading } = useCrmActivities({});
    return (_jsx(Page, { title: "Activities", description: "View and manage activities", actions: _jsxs(Button, { variant: "primary", onClick: () => window.location.href = '/crm/activities/new', children: [_jsx(Plus, { size: 16, className: "mr-2" }), "New Activity"] }), children: _jsx(Card, { children: loading ? (_jsx(Spinner, {})) : (_jsx(DataTable, { columns: [
                    { key: 'activityType', label: 'Type' },
                    { key: 'taskDescription', label: 'Description' },
                    { key: 'taskDueDate', label: 'Due Date' },
                    { key: 'createdOnTimestamp', label: 'Created', sortable: true },
                ], data: data || [], onRowClick: (row) => {
                    window.location.href = `/crm/activities/${row.id}`;
                } })) }) }));
}
export default ActivityList;
//# sourceMappingURL=ActivityList.js.map