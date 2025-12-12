'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useUi } from '@hit/ui-kit';
import { useCrmDeals } from '../hooks/useCrmDeals';
import { KanbanView } from '../components/KanbanView';
export function DealList({ onNavigate }) {
    const { Page, Button, Tabs } = useUi();
    const [view, setView] = useState('kanban');
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    return (_jsx(Page, { title: "Deals", description: "Manage your sales pipeline", actions: _jsxs(Button, { variant: "primary", onClick: () => navigate('/crm/deals/new'), children: [_jsx(Plus, { size: 16, className: "mr-2" }), "New Deal"] }), children: _jsx(Tabs, { activeTab: view, onChange: (tabId) => setView(tabId), tabs: [
                { id: 'kanban', label: 'Kanban', content: _jsx(KanbanView, {}) },
                { id: 'list', label: 'List', content: _jsx(DealListView, { onNavigate: onNavigate }) },
            ] }) }));
}
function DealListView({ onNavigate }) {
    const { Card, DataTable, Spinner, Modal, Button: UIButton } = useUi();
    const { data, loading, deleteDeal, refetch } = useCrmDeals({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = (path) => {
        if (onNavigate) {
            onNavigate(path);
        }
        else if (typeof window !== 'undefined') {
            window.location.href = path;
        }
    };
    const handleDelete = async () => {
        if (!deleteConfirm)
            return;
        setIsDeleting(true);
        try {
            await deleteDeal(deleteConfirm.id);
            await refetch();
            setDeleteConfirm(null);
        }
        catch (error) {
            console.error('Failed to delete deal:', error);
            alert(error?.message || 'Failed to delete deal');
        }
        finally {
            setIsDeleting(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Card, { children: loading ? (_jsx(Spinner, {})) : (_jsx(DataTable, { columns: [
                        { key: 'dealName', label: 'Deal Name', sortable: true },
                        { key: 'amount', label: 'Amount', sortable: true },
                        { key: 'closeDateEstimate', label: 'Close Date' },
                        {
                            key: 'actions',
                            label: '',
                            sortable: false,
                            hideable: false,
                            align: 'right',
                            render: (_value, row) => (_jsx("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: _jsx(UIButton, { variant: "ghost", size: "sm", onClick: (e) => {
                                        e.stopPropagation();
                                        setDeleteConfirm({ id: String(row.id), name: String(row.dealName) });
                                    }, children: _jsx(Trash2, { size: 16, style: { color: 'var(--hit-error, #ef4444)' } }) }) })),
                        },
                    ], data: data?.items || [], onRowClick: (row) => navigate(`/crm/deals/${String(row.id)}`) })) }), deleteConfirm && (_jsx(Modal, { open: true, onClose: () => setDeleteConfirm(null), title: "Delete Deal", children: _jsxs("div", { style: { padding: '16px' }, children: [_jsxs("p", { style: { marginBottom: '16px' }, children: ["Are you sure you want to delete \"", deleteConfirm.name, "\"? This action cannot be undone."] }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(UIButton, { variant: "secondary", onClick: () => setDeleteConfirm(null), children: "Cancel" }), _jsx(UIButton, { variant: "danger", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? 'Deleting...' : 'Delete' })] })] }) }))] }));
}
export default DealList;
//# sourceMappingURL=DealList.js.map